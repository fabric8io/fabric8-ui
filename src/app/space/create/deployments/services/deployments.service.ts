import {
  ErrorHandler,
  Inject,
  Injectable,
  InjectionToken,
  OnDestroy
} from '@angular/core';

import { Response } from '@angular/http';

import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';

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
  isEqual as deepEqual,
  round
} from 'lodash';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetStat } from '../models/scaled-net-stat';
import {
  Application,
  ApplicationAttributes,
  CoresSeries,
  Deployment,
  DeploymentApiService,
  DeploymentAttributes,
  EnvironmentAttributes,
  EnvironmentStat,
  MemorySeries,
  MultiTimeseriesData,
  PodsQuota,
  TimeseriesData
} from './deployment-api.service';

export const TIMER_TOKEN: InjectionToken<Observable<void>> = new InjectionToken<Observable<void>>('DeploymentsServiceTimer');
export const TIMESERIES_SAMPLES_TOKEN: InjectionToken<number> = new InjectionToken<number>('DeploymentsServiceTimeseriesSamples');

@Injectable()
export class DeploymentsService implements OnDestroy {

  static readonly INITIAL_UPDATE_DELAY: number = 0;
  static readonly POLL_RATE_MS: number = 60000;

  static readonly FRONT_LOAD_SAMPLES: number = 15;
  static readonly FRONT_LOAD_WINDOW_WIDTH: number = DeploymentsService.FRONT_LOAD_SAMPLES * DeploymentsService.POLL_RATE_MS;

  private readonly appsObservables: Map<string, Observable<Application[]>> = new Map<string, Observable<Application[]>>();
  private readonly envsObservables: Map<string, Observable<EnvironmentStat[]>> = new Map<string, Observable<EnvironmentStat[]>>();
  private readonly timeseriesSubjects: Map<string, Subject<TimeseriesData[]>> = new Map<string, Subject<TimeseriesData[]>>();

  private readonly serviceSubscriptions: Subscription[] = [];

  constructor(
    private readonly apiService: DeploymentApiService,
    private readonly logger: Logger,
    private readonly errorHandler: ErrorHandler,
    private readonly notifications: NotificationsService,
    @Inject(TIMER_TOKEN) private readonly pollTimer: Observable<void>,
    @Inject(TIMESERIES_SAMPLES_TOKEN) private readonly timeseriesSamples: number
  ) { }

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

  getEnvironments(spaceId: string): Observable<string[]> {
    // Note: Sorting and filtering out test should ideally be moved to the backend
    return this.getEnvironmentsResponse(spaceId)
      .map((envs: EnvironmentStat[]) => envs || [])
      .map((envs: EnvironmentStat[]) => envs.map((env: EnvironmentStat) => env.attributes))
      .map((envs: EnvironmentAttributes[]) => envs.sort((a, b) => -1 * a.name.localeCompare(b.name)))
      .map((envs: EnvironmentAttributes[]) => envs
        .filter((env: EnvironmentAttributes) => env.name !== 'test')
        .map((env: EnvironmentAttributes) => env.name)
      )
      .distinctUntilChanged((p: string[], q: string[]) => deepEqual(new Set<string>(p), new Set<string>(q)));
  }

  isApplicationDeployedInEnvironment(spaceId: string, environmentName: string, applicationId: string):
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

  getVersion(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.attributes.version)
      .distinctUntilChanged();
  }

  scalePods(spaceId: string, environmentName: string, applicationId: string, desiredReplicas: number): Observable<string> {
    return this.apiService.scalePods(spaceId, environmentName, applicationId, desiredReplicas)
      .map((r: Response) => `Successfully scaled ${applicationId}`)
      .catch(err => Observable.throw(`Failed to scale ${applicationId}`));
  }

  getPods(spaceId: string, environmentName: string, applicationId: string): Observable<Pods> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.attributes)
      .map((attrs: DeploymentAttributes) => {
        const pods = attrs.pods
          .sort((a: [string, string], b: [string, string]): number =>
            a[0].localeCompare(b[0])
          )
          .map((entry: [string, string]): [string, number] =>
            [entry[0], parseInt(entry[1])]
          );
        return {
          total: attrs.pod_total,
          pods: pods
        } as Pods;
      })
      .distinctUntilChanged(deepEqual);
  }

  getPodsQuota(spaceId: string, environmentName: string, applicationId: string): Observable<PodsQuota> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.attributes)
      .filter((attrs: DeploymentAttributes) => attrs && has(attrs, 'pods_quota'))
      .map((attrs: DeploymentAttributes) => attrs.pods_quota)
      .distinctUntilChanged(deepEqual);
  }

  getDeploymentCpuStat(spaceId: string, environmentName: string, applicationId: string, maxSamples: number = this.timeseriesSamples): Observable<CpuStat[]> {
    const series = this.getTimeseriesData(spaceId, environmentName, applicationId, maxSamples)
      .filter((t: TimeseriesData[]) => t && t.some((el: TimeseriesData) => has(el, 'cores')))
      .map((t: TimeseriesData[]) => t.map((s: TimeseriesData) => s.cores));
    const quota = this.getPodsQuota(spaceId, environmentName, applicationId)
      .map((podsQuota: PodsQuota) => podsQuota.cpucores)
      .distinctUntilChanged();
    return Observable.combineLatest(series, quota, (series: CoresSeries[], quota: number) =>
      series.map((s: CoresSeries) =>
        ({ used: round(s.value, 4), quota: quota, timestamp: s.time } as CpuStat)
      )
    );
  }

  getDeploymentMemoryStat(spaceId: string, environmentName: string, applicationId: string, maxSamples: number = this.timeseriesSamples): Observable<MemoryStat[]> {
    const series = this.getTimeseriesData(spaceId, environmentName, applicationId, maxSamples)
      .filter((t: TimeseriesData[]) => t && t.some((el: TimeseriesData) => has(el, 'memory')))
      .map((t: TimeseriesData[]) => t.map((s: TimeseriesData) => s.memory));
    const quota = this.getPodsQuota(spaceId, environmentName, applicationId)
      .map((podsQuota: PodsQuota) => podsQuota.memory)
      .distinctUntilChanged();
    return Observable.combineLatest(series, quota, (series: MemorySeries[], quota: number) =>
      series.map((s: MemorySeries) => new ScaledMemoryStat(s.value, quota, s.time)
      )
    );
  }

  getDeploymentNetworkStat(spaceId: string, environmentName: string, applicationId: string, maxSamples: number = this.timeseriesSamples): Observable<NetworkStat[]> {
    return this.getTimeseriesData(spaceId, environmentName, applicationId, maxSamples)
      .filter((t: TimeseriesData[]) => t && t.some((el: TimeseriesData) => has(el, 'net_tx')) && t.some((el: TimeseriesData) => has(el, 'net_rx')))
      .map((t: TimeseriesData[]) =>
        t.map((s: TimeseriesData) =>
        ({
          sent: new ScaledNetStat(s.net_tx.value, s.net_tx.time),
          received: new ScaledNetStat(s.net_rx.value, s.net_rx.time)
        }))
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

  getLogsUrl(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.links.logs);
  }

  getConsoleUrl(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.links.console);
  }

  getAppUrl(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId)
      .map((deployment: Deployment) => deployment.links.application);
  }

  deleteDeployment(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.apiService.deleteDeployment(spaceId, environmentName, applicationId)
      .map((r: Response) => `Deployment has successfully deleted`)
      .catch(err => Observable.throw(`Failed to delete ${applicationId} in ${spaceId} (${environmentName})`));
  }

  private getApplicationsResponse(spaceId: string): Observable<Application[]> {
    if (!this.appsObservables.has(spaceId)) {
      const subject = new ReplaySubject<Application[]>(1);
      const observable = this.pollTimer
        .concatMap(() =>
          this.apiService.getApplications(spaceId)
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

  private getDeployment(spaceId: string, environmentName: string, applicationId: string): Observable<Deployment> {
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
          this.apiService.getEnvironments(spaceId)
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

  private getTimeseriesData(spaceId: string, environmentName: string, applicationId: string, maxSamples: number): Observable<TimeseriesData[]> {
    return this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId)
      .first()
      .flatMap((deployed: boolean) => {
        if (!deployed) {
          return Observable.never();
        }
        const key = `${spaceId}:${applicationId}:${environmentName}`;
        if (!this.timeseriesSubjects.has(key)) {
          const subject = new ReplaySubject<TimeseriesData[]>(this.timeseriesSamples);

          const now = +Date.now();
          const frontLoadedUpdates = this.getInitialTimeseriesData(spaceId, environmentName, applicationId, now - DeploymentsService.FRONT_LOAD_WINDOW_WIDTH, now);

          const polledUpdates = this.getStreamingTimeseriesData(spaceId, environmentName, applicationId);

          const seriesData = Observable.concat(frontLoadedUpdates, polledUpdates)
            .finally(() => {
              this.timeseriesSubjects.delete(key);
            })
            .bufferCount(this.timeseriesSamples, 1);
          this.serviceSubscriptions.push(seriesData.subscribe(subject));
          this.timeseriesSubjects.set(key, subject);
        }
        return this.timeseriesSubjects.get(key)
          .map((data: TimeseriesData[]) => {
            if (maxSamples >= data.length) {
              return data;
            }
            return data.slice(data.length - maxSamples);
          });
      });
  }

  private getInitialTimeseriesData(spaceId: string, environmentName: string,  applicationId: string, startTime: number, endTime: number): Observable<TimeseriesData> {
    return this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId)
      .first()
      .flatMap((deployed: boolean) => {
        if (!deployed) {
          return Observable.empty();
        }
        return this.apiService.getTimeseriesData(spaceId, environmentName, applicationId, startTime, endTime)
          .catch((err: Response) => this.handleHttpError(err))
          .filter((t: MultiTimeseriesData) => !!t && !isEmpty(t))
          .concatMap((t: MultiTimeseriesData) => {
            const results: TimeseriesData[] = [];
            const numSamples = t.cores.length;
            for (let i = 0; i < numSamples; i++) {
              results.push({
                cores: {
                  time: t.cores[i].time,
                  value: t.cores[i].value
                },
                memory: {
                  time: t.memory[i].time,
                  value: t.memory[i].value
                },
                net_tx: {
                  time: t.net_tx[i].time,
                  value: t.net_tx[i].value
                },
                net_rx: {
                  time: t.net_rx[i].time,
                  value: t.net_rx[i].value
                }
              });
            }
            return Observable.from(results);
          });
      }
      );
  }

  private getStreamingTimeseriesData(spaceId: string, environmentName: string, applicationId: string): Observable<TimeseriesData> {
    return this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId)
      .first()
      .flatMap((deployed: boolean) => {
        if (!deployed) {
          return Observable.empty();
        }
        /* piggyback on getApplicationsResponse rather than pollTimer directly in order to
        * establish a happens-before relationship between applications updates and timeseries
        * updates within each poll cycle, so that we can detect a deployment disappearing and
        * cancel upcoming timeseries queries
        */
        return this.getApplicationsResponse(spaceId)
          .takeUntil(
            this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId)
              .filter((deployed: boolean): boolean => !deployed)
          )
          .concatMap(() =>
            this.apiService.getLatestTimeseriesData(spaceId, environmentName, applicationId)
              .catch((err: Response) => this.handleHttpError(err))
              .filter((t: TimeseriesData) => !!t && !isEmpty(t))
          );
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
