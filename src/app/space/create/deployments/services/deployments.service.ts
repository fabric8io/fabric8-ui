import {
  ErrorHandler,
  Inject,
  Injectable,
  OnDestroy
} from '@angular/core';

import { round } from 'lodash';

import {
  Headers,
  Http,
  Response
} from '@angular/http';

import {
  Observable,
  ReplaySubject,
  Subscription
} from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import { NotificationsService } from 'app/shared/notifications.service';
import {
  Logger,
  Notification,
  NotificationType
} from 'ngx-base';

import {
  flatten,
  has,
  includes,
  isEmpty,
  isEqual as deepEqual
} from 'lodash';

import { CpuStat } from '../models/cpu-stat';
import { Environment as ModelEnvironment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { Pods as ModelPods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetworkStat } from '../models/scaled-network-stat';

export interface NetworkStat {
  sent: ScaledNetworkStat;
  received: ScaledNetworkStat;
}

export interface ApplicationsResponse {
  data: Space;
}

export interface Space {
  attributes: SpaceAttributes;
  id: string;
  type: string;
}

export interface SpaceAttributes {
  applications: Application[];
}

export interface EnvironmentsResponse {
  data: EnvironmentStat[];
}

export interface TimeseriesResponse {
  data: DeploymentStats;
}

export interface MultiTimeseriesResponse {
  data: MultiTimeseriesData;
}

export interface Application {
  attributes: ApplicationAttributes;
  id: string;
  type: string;
}

export interface ApplicationAttributes {
  name: string;
  deployments: Deployment[];
}

export interface ApplicationAttributesOverview {
  appName: string;
  deploymentsInfo: DeploymentPreviewInfo[];
}

export interface DeploymentPreviewInfo {
  name: string;
  version: string;
  url: string;
}

export interface Deployment {
  attributes: DeploymentAttributes;
  links: Links;
  id: string;
  type: string;
}

export interface DeploymentAttributes {
  name: string;
  pod_total: number;
  pods: [[string, string]];
  version: string;
}

export interface Links {
  application: string;
  console: string;
  logs: string;
}

export interface Environment {
  name: string;
  pods: Pods;
  version: string;
}

export interface EnvironmentStat {
  attributes: EnvironmentAttributes;
  id: string;
  type: string;
}

export interface EnvironmentAttributes {
  name: string;
  quota: Quota;
}

export interface Quota {
  cpucores: CpuStat;
  memory: MemoryStat;
}

export interface Pods {
  running: number;
  starting: number;
  stopping: number;
  total: number;
}

export interface DeploymentStats {
  attributes: TimeseriesData;
  id: string;
  type: string;
}

export interface TimeseriesData {
  cores: CoresSeries;
  memory: MemorySeries;
  net_tx: NetworkSentSeries;
  net_rx: NetworkReceivedSeries;
}

export interface MultiTimeseriesData {
  cores: CoresSeries[];
  memory: MemorySeries[];
  net_tx: NetworkSentSeries[];
  net_rx: NetworkReceivedSeries[];
  start: number;
  end: number;
}

export interface TimeConstrainedStats {
  cpu: CpuStat[];
  memory: MemoryStat[];
  network: NetworkStat[];
}

export interface CoresSeries extends SeriesData { }

export interface MemorySeries extends SeriesData { }

export interface NetworkSentSeries extends SeriesData { }

export interface NetworkReceivedSeries extends SeriesData { }

export interface SeriesData {
  time: number;
  value: number;
}

@Injectable()
export class DeploymentsService implements OnDestroy {

  static readonly INITIAL_UPDATE_DELAY: number = 0;
  static readonly POLL_RATE_MS: number = 60000;

  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  apiUrl: string;

  private readonly appsObservables = new Map<string, Observable<Application[]>>();
  private readonly envsObservables = new Map<string, Observable<EnvironmentStat[]>>();
  private readonly timeseriesObservables = new Map<string, Observable<TimeseriesData>>();
  private readonly multiTimeseriesObservables = new Map<string, Observable<MultiTimeseriesData>>();

  private readonly pollTimer = Observable
    .timer(DeploymentsService.INITIAL_UPDATE_DELAY, DeploymentsService.POLL_RATE_MS)
    .share();

  private serviceSubscriptions: Subscription[] = [];

  constructor(
    public http: Http,
    public auth: AuthenticationService,
    public logger: Logger,
    public errorHandler: ErrorHandler,
    public notifications: NotificationsService,
    @Inject(WIT_API_URL) witUrl: string
  ) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.apiUrl = witUrl + 'deployments/spaces/';
  }

  ngOnDestroy(): void {
    this.serviceSubscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  getApplications(spaceId: string): Observable<string[]> {
    return this.getApplicationsResponse(spaceId)
      .map((apps: Application[]) => apps || [])
      .map((apps: Application[]) => apps.map((app: Application) => app.attributes.name))
      .distinctUntilChanged(deepEqual);
  }

  getEnvironments(spaceId: string): Observable<ModelEnvironment[]> {
    // Note: Sorting and filtering out test should ideally be moved to the backend
    return this.getEnvironmentsResponse(spaceId)
      .map((envs: EnvironmentStat[]) => envs || [])
      .map((envs: EnvironmentStat[]) => envs.map((env: EnvironmentStat) => env.attributes))
      .map((envs: EnvironmentAttributes[]) => envs.sort((a, b) =>  -1 * a.name.localeCompare(b.name)))
      .map((envs: EnvironmentAttributes[]) => envs
        .filter((env: EnvironmentAttributes) => env.name !== 'test')
        .map((env: EnvironmentAttributes) => ({ name: env.name} as ModelEnvironment))
      )
      .distinctUntilChanged((p: ModelEnvironment[], q: ModelEnvironment[]) =>
        deepEqual(new Set<string>(p.map(v => v.name)), new Set<string>(q.map(v => v.name))));
  }

  getAppsAndEnvironments(spaceId: string): Observable<ApplicationAttributesOverview[]> {
    return this.getApplicationsResponse(spaceId)
      .map((apps: Application[]) => apps || [])
      .map((apps: Application[]) => apps.map((app: Application) => {
        const appName = app.attributes.name;
        const deploymentNamesAndVersions = app.attributes.deployments.map(
          (dep: Deployment) => ({ name: dep.attributes.name, version: dep.attributes.version, url: dep.links.application
          })
        );

        return {
          appName: appName,
          deploymentsInfo: deploymentNamesAndVersions as DeploymentPreviewInfo[]
        } as ApplicationAttributesOverview;
      }));
  }

  isApplicationDeployedInEnvironment(spaceId: string, applicationId: string, environmentName: string):
    Observable<boolean> {
    return this.getApplication(spaceId, applicationId)
      .map((app: Application) => app.attributes.deployments)
      .map((deployments: Deployment[]) => deployments || [])
      .map((deployments: Deployment[]) => includes(deployments.map((d: Deployment) => d.attributes.name), environmentName))
      .distinctUntilChanged();
  }

  isDeployedInEnvironment(spaceId: string, environmentName: string):
    Observable<boolean> {
    return this.getApplicationsResponse(spaceId)
      .map((apps: Application[]) => apps || [])
      .map((apps: Application[]) => apps.map((app: Application) => app.attributes.deployments || []))
      .map((deployments: Deployment[][]) => deployments.map((pipeline: Deployment[]) => pipeline.map((deployment: Deployment) => deployment.attributes.name)))
      .map((pipeEnvNames: string[][]) => flatten(pipeEnvNames))
      .map((envNames: string[]) => includes(envNames, environmentName))
      .distinctUntilChanged();
  }

  getVersion(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((deployment: Deployment) => deployment.attributes.version)
      .distinctUntilChanged();
  }

  scalePods(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    desiredReplicas: number
  ): Observable<string> {
    const url = `${this.apiUrl}${spaceId}/applications/${applicationId}/deployments/${environmentName}?podCount=${desiredReplicas}`;
    return this.http.put(url, '', { headers: this.headers })
      .map((r: Response) => `Successfully scaled ${applicationId}`)
      .catch(err => Observable.throw(`Failed to scale ${applicationId}`));
  }

  getPods(spaceId: string, applicationId: string, environmentName: string): Observable<ModelPods> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((deployment: Deployment) => deployment.attributes)
      .map((attrs: DeploymentAttributes) => {
        const pods = [];
        attrs.pods.forEach(p => {
          pods.push([ p[0], parseInt(p[1])]);
        });
        return {
          total: attrs.pod_total,
          pods: pods
        } as ModelPods;
      })
      .distinctUntilChanged(deepEqual);
  }

  getDeploymentCpuStat(spaceId: string, applicationId: string, environmentName: string): Observable<CpuStat> {
    const series = this.getTimeseriesData(spaceId, applicationId, environmentName)
      .filter((t: TimeseriesData) => t && has(t, 'cores'))
      .map((t: TimeseriesData) => t.cores);
    const quota = this.getEnvironmentCpuStat(spaceId, environmentName)
      .map((stat: CpuStat) => stat.quota)
      .distinctUntilChanged();
      return Observable.combineLatest(series, quota, (series: CoresSeries, quota: number) => ({ used: series.value, quota: quota, timestamp: series.time } as CpuStat));
  }

  getDeploymentMemoryStat(spaceId: string, applicationId: string, environmentName: string): Observable<MemoryStat> {
    const series = this.getTimeseriesData(spaceId, applicationId, environmentName)
      .filter((t: TimeseriesData) => t && has(t, 'memory'))
      .map((t: TimeseriesData) => t.memory);
    const quota = this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => env.attributes.quota.memory.quota)
      .distinctUntilChanged();
      return Observable.combineLatest(series, quota, (series: MemorySeries, quota: number) => new ScaledMemoryStat(series.value, quota, series.time) as MemoryStat);
  }

  getDeploymentNetworkStat(spaceId: string, applicationId: string, environmentName: string): Observable<NetworkStat> {
    return this.getTimeseriesData(spaceId, applicationId, environmentName)
      .filter((t: TimeseriesData) => t && has(t, 'net_tx') && has(t, 'net_rx'))
      .map((t: TimeseriesData) =>
        ({
          sent: new ScaledNetworkStat(t.net_tx.value, t.net_tx.time),
          received: new ScaledNetworkStat(t.net_rx.value, t.net_rx.time)
        } as NetworkStat)
      );
  }

  getDeploymentTimeConstrainedStats(spaceId: string, applicationId: string, environmentName: string, elapsedTime: number, endTime: number = Date.now()): Observable<TimeConstrainedStats> {
    const startTime = endTime - elapsedTime;
    const series = this.getTimeConstrainedTimeseriesData(spaceId, applicationId, environmentName, startTime, endTime);
    // Process CPU Stats
    const coresSeries: Observable<CoresSeries[]> = series.map((t: MultiTimeseriesData) => t.cores);
    const cpuQuota = this.getEnvironmentCpuStat(spaceId, environmentName).map((stat: CpuStat) => stat.quota);
    let cpuStats = Observable.combineLatest(coresSeries, cpuQuota, (coresSeries: CoresSeries[], cpuQuota: number) => {
      let arr = [];
      for (let i = 0; i < coresSeries.length; i++) {
        arr.push({ used: coresSeries[i].value, quota: cpuQuota, timestamp: coresSeries[i].time } as CpuStat);
      }
      return arr;
    });
    // Process Memory Stats
    const memSeries: Observable<MemorySeries[]> = series.map((t: MultiTimeseriesData) => t.memory);
    const memQuota = this.getEnvironment(spaceId, environmentName).map((env: EnvironmentStat) => env.attributes.quota.memory.quota);
    let memStats = Observable.combineLatest(memSeries, memQuota, (memSeries: MemorySeries[], memQuota: number) => {
      let arr = [];
      for (let i = 0; i < memSeries.length; i++) {
        arr.push(new ScaledMemoryStat(memSeries[i].value, memQuota, memSeries[i].time));
      }
      return arr;
    });
    // Process Network Stats
    const net_txSeries: Observable<NetworkSentSeries[]> = series.map((t: MultiTimeseriesData) => t.net_tx);
    const net_rxSeries: Observable<NetworkReceivedSeries[]> = series.map((t: MultiTimeseriesData) => t.net_rx);
    let networkStats: Observable<NetworkStat[]> = Observable.combineLatest(net_txSeries, net_rxSeries).map((n) => {
      let arr = [];
      for (let i = 0; i < n[0].length; i++) {
        arr.push({ sent: new ScaledNetworkStat(n[0][i].value, n[0][i].time), received: new ScaledNetworkStat(n[1][i].value, n[1][i].time) } as NetworkStat);
      }
      return arr;
    });
    return Observable.combineLatest(cpuStats, memStats, networkStats, (
        cpuStats: CpuStat[],
        memStats: MemoryStat[],
        networkStats: NetworkStat[]
      ) => ({ cpu: cpuStats, memory: memStats, network: networkStats })
    );
  }

  getEnvironmentCpuStat(spaceId: string, environmentName: string): Observable<CpuStat> {
    return this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => env.attributes.quota.cpucores);
  }

  getEnvironmentMemoryStat(spaceId: string, environmentName: string): Observable<MemoryStat> {
    return this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => new ScaledMemoryStat(env.attributes.quota.memory.used, env.attributes.quota.memory.quota));
  }

  getLogsUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((deployment: Deployment) => deployment.links.logs);
  }

  getConsoleUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((deployment: Deployment) => deployment.links.console);
  }

  getAppUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((deployment: Deployment) => deployment.links.application);
  }

  deleteApplication(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    if (Math.random() > 0.5) {
      return Observable.of(`Deleted ${applicationId} in ${spaceId} (${environmentName})`);
    } else {
      return Observable.throw(`Failed to delete ${applicationId} in ${spaceId} (${environmentName})`);
    }
  }

  private getApplicationsResponse(spaceId: string): Observable<Application[]> {
    if (!this.appsObservables.has(spaceId)) {
      const subject = new ReplaySubject<Application[]>(1);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId, { headers: this.headers })
            .map((response: Response) => (response.json() as ApplicationsResponse).data.attributes.applications)
            .catch((err: Response) => this.handleHttpError(err))
        );
      this.serviceSubscriptions.push(observable.subscribe(subject));
      this.appsObservables.set(spaceId, subject);
    }
    return this.appsObservables.get(spaceId);
  }

  private getApplication(spaceId: string, applicationId: string): Observable<Application> {
    // does not emit if there are no applications matching the specified name
    return this.getApplicationsResponse(spaceId)
      .flatMap((apps: Application[]) => apps || [])
      .filter((app: Application) => app.attributes.name === applicationId);
  }

  private getDeployment(spaceId: string, applicationId: string, environmentName: string): Observable<Deployment> {
    // does not emit if there are no applications or environments matching the specified names
    return this.getApplication(spaceId, applicationId)
      .flatMap((app: Application) => app.attributes.deployments || [])
      .filter((deployment: Deployment) => deployment.attributes.name === environmentName);
  }

  private getEnvironmentsResponse(spaceId: string): Observable<EnvironmentStat[]> {
    if (!this.envsObservables.has(spaceId)) {
      const subject = new ReplaySubject<EnvironmentStat[]>(1);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId + '/environments', { headers: this.headers })
            .map((response: Response) => (response.json() as EnvironmentsResponse).data)
            .catch((err: Response) => this.handleHttpError(err))
        );
      this.serviceSubscriptions.push(observable.subscribe(subject));
      this.envsObservables.set(spaceId, subject);
    }
    return this.envsObservables.get(spaceId);
  }

  private getEnvironment(spaceId: string, environmentName: string): Observable<EnvironmentStat> {
    // does not emit if there are no environments matching the specified name
    return this.getEnvironmentsResponse(spaceId)
      .flatMap((envs: EnvironmentStat[]) => envs || [])
      .filter((env: EnvironmentStat) => env.attributes.name === environmentName);
  }

  private getTimeseriesData(spaceId: string, applicationId: string, environmentName: string): Observable<TimeseriesData> {
    return this.isApplicationDeployedInEnvironment(spaceId, applicationId, environmentName)
      .flatMap((deployed: boolean) => {
        if (deployed) {
          const key = `${spaceId}:${applicationId}:${environmentName}`;
          if (!this.timeseriesObservables.has(key)) {
            const subject = new ReplaySubject<TimeseriesData>(1);

            const url = `${this.apiUrl}${spaceId}/applications/${applicationId}/deployments/${environmentName}/stats`;
            const observable = Observable.concat(Observable.of(0), this.pollTimer)
              .concatMap(() =>
                this.http.get(url, { headers: this.headers })
                  .map((response: Response) => (response.json() as TimeseriesResponse).data.attributes)
                  .catch((err: Response) => this.handleHttpError(err))
                  .filter((t: TimeseriesData) => !!t && !isEmpty(t))
              );
            this.serviceSubscriptions.push(observable.subscribe(subject));
            this.timeseriesObservables.set(key, subject);
          }
          return this.timeseriesObservables.get(key);
        } else {
          const currentTime = +Date.now();
          const emptyResult: TimeseriesData = {
            cores: {
              time: currentTime,
              value: 0
            },
            memory: {
              time: currentTime,
              value: 0
            },
            net_tx: {
              time: currentTime,
              value: 0
            },
            net_rx: {
              time: currentTime,
              value: 0
            }
          };
          return Observable.of(emptyResult);
        }
      });
  }

  private getTimeConstrainedTimeseriesData(spaceId: string, applicationId: string, environmentName: string, startTime: number, endTime: number): Observable<MultiTimeseriesData> {
    return this.isApplicationDeployedInEnvironment(spaceId, applicationId, environmentName)
    .flatMap((deployed: boolean) => {
      if (deployed) {
        const key = `${spaceId}:${applicationId}:${environmentName}`;
        if (!this.multiTimeseriesObservables.has(key)) {
          const subject = new ReplaySubject<MultiTimeseriesData>(1);

          const url = `${this.apiUrl}${spaceId}/applications/${applicationId}/deployments/${environmentName}/statseries?start=${startTime}&end=${endTime}`;
          const observable = this.http.get(url, { headers: this.headers })
            .map((response: Response) => (response.json() as MultiTimeseriesResponse).data)
            .catch((err: Response) => this.handleHttpError(err))
            .filter((t: MultiTimeseriesData) => !!t && !isEmpty(t));
          this.serviceSubscriptions.push(observable.subscribe(subject));
          this.multiTimeseriesObservables.set(key, subject);
        }
        return this.multiTimeseriesObservables.get(key);
      } else {
        const emptyResult: MultiTimeseriesData = {
          cores: [],
          memory: [],
          net_tx: [],
          net_rx: [],
          start: startTime,
          end: endTime
        };
        return Observable.of(emptyResult);
      }
    });
  }

  private handleHttpError(response: Response): Observable<any> {
    this.errorHandler.handleError(response);
    this.logger.error(response);
    this.notifications.message({
      type: NotificationType.DANGER,
      header: `Request failed: ${response.status} (${response.statusText})`,
      message: response.text()
    } as Notification);
    return Observable.empty();
  }
}
