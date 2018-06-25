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

import {
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

import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import {
  MemoryUnit,
  ordinal
} from '../models/memory-unit';
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
export const POLL_RATE_TOKEN: InjectionToken<number> = new InjectionToken<number>('DeploymentsServicePollRate');

@Injectable()
export class DeploymentsService implements OnDestroy {

  static readonly DEFAULT_INITIAL_UPDATE_DELAY: number = 0;
  static readonly DEFAULT_POLL_RATE_MS: number = 60000;
  static readonly DEFAULT_FRONT_LOAD_SAMPLES: number = 15;

  private readonly appsObservables: Map<string, Observable<Application[]>> = new Map<string, Observable<Application[]>>();
  private readonly envsObservables: Map<string, Observable<EnvironmentStat[]>> = new Map<string, Observable<EnvironmentStat[]>>();
  private readonly timeseriesSubjects: Map<string, Subject<TimeseriesData[]>> = new Map<string, Subject<TimeseriesData[]>>();
  private readonly frontLoadWindowWidth: number;

  private readonly serviceSubscriptions: Subscription[] = [];

  constructor(
    private readonly apiService: DeploymentApiService,
    private readonly notifications: NotificationsService,
    @Inject(TIMER_TOKEN) private readonly pollTimer: Observable<void>,
    @Inject(TIMESERIES_SAMPLES_TOKEN) private readonly timeseriesSamples: number,
    @Inject(POLL_RATE_TOKEN) private readonly pollRate: number
  ) {
    this.frontLoadWindowWidth = timeseriesSamples * pollRate;
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

  getEnvironments(spaceId: string): Observable<string[]> {
    return this.getEnvironmentsResponse(spaceId)
      .map((envs: EnvironmentStat[]) => envs || [])
      .map((envs: EnvironmentStat[]) => envs.map((env: EnvironmentStat) => env.attributes))
      .map((envs: EnvironmentAttributes[]) => envs.map((env: EnvironmentAttributes) => env.name))
      .map((envs: string[]): string[] => envs.sort((a: string, b: string): number => b.localeCompare(a)))
      .distinctUntilChanged(deepEqual);
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

  hasDeployments(spaceId: string, environments: string[]): Observable<boolean> {
    return Observable.combineLatest(
      environments.map(environment => this.isDeployedInEnvironment(spaceId, environment))
    ).map((deployed: boolean[]): boolean => deployed.some(b => b));
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
    return Observable.combineLatest(series, quota, (memSeries: MemorySeries[], quota: number) => {
      const rawStats: ScaledMemoryStat[] = memSeries
        .map((s: MemorySeries) => new ScaledMemoryStat(s.value, quota, s.time));
      const greatestOrdinal: number = rawStats
        .map((stat: ScaledMemoryStat): MemoryUnit => stat.units)
        .map((unit: MemoryUnit): number => ordinal(unit))
        .reduce((acc: number, next: number): number => Math.max(acc, next));
      const greatestUnit: MemoryUnit = MemoryUnit[Object.keys(MemoryUnit)[greatestOrdinal]];
      return rawStats
        .map((stat: ScaledMemoryStat): ScaledMemoryStat => ScaledMemoryStat.from(stat, greatestUnit));
    });
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
      )
      .map((stats: NetworkStat[]): NetworkStat[] => {
        const greatestOrdinal: number = stats
          .map((stat: NetworkStat): [MemoryUnit, MemoryUnit] => [stat.sent.units, stat.received.units])
          .map((units: [MemoryUnit, MemoryUnit]): number => Math.max(ordinal(units[0]), ordinal(units[1])))
          .reduce((acc: number, next: number): number => Math.max(acc, next));
        const greatestUnit: MemoryUnit = MemoryUnit[Object.keys(MemoryUnit)[greatestOrdinal]];

        return stats
          .map((stat: NetworkStat): NetworkStat => ({
            sent: ScaledNetStat.from(stat.sent, greatestUnit),
            received: ScaledNetStat.from(stat.received, greatestUnit)
          }));
      });
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
            .catch((err: Response) => {
              let header: string = 'Cannot get applications';
              return this.handleHttpError(header, err);
            })
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
            .catch((err: Response) => {
              let header: string = 'Cannot get environments';
              return this.handleHttpError(header, err);
            })
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
    const key = `${spaceId}:${applicationId}:${environmentName}`;
    if (!this.timeseriesSubjects.has(key)) {
      const subject = new ReplaySubject<TimeseriesData[]>(this.timeseriesSamples);

      const now = +Date.now();
      const seriesData = this.getStreamingTimeseriesData(spaceId, environmentName, applicationId, now - this.frontLoadWindowWidth, now)
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
  }

  private getStreamingTimeseriesData(spaceId: string, environmentName: string, applicationId: string, startTime: number, endTime: number): Observable<TimeseriesData> {
    return Observable.combineLatest(
      this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId),
      this.getPods(spaceId, environmentName, applicationId).map((p: Pods): number => p.total),
      this.pollTimer.startWith(null)
    )
      .startWith([false, 0, null])
      .pairwise()
      .concatMap((status: [[boolean, number, void], [boolean, number, void]]): Observable<TimeseriesData> => {
        const prev: [boolean, number, void] = status[0];
        const curr: [boolean, number, void] = status[1];

        const isDeployed: boolean = curr[0] && curr[1] > 0;
        const wasDeployed: boolean = prev[0] && prev[1] > 0;

        if (!isDeployed) {
          return Observable.empty();
        }

        if (!wasDeployed) {
          return this.getInitialTimeseriesData(spaceId, environmentName, applicationId, startTime, endTime);
        } else {
          return this.apiService.getLatestTimeseriesData(spaceId, environmentName, applicationId)
            .catch((err: Response) => {
              let header: string = 'Cannot get latest application statistics';
              return this.handleHttpError(header, err);
            })
            .filter((t: TimeseriesData) => !!t && !isEmpty(t));
        }
      });
  }

  private getInitialTimeseriesData(spaceId: string, environmentName: string,  applicationId: string, startTime: number, endTime: number): Observable<TimeseriesData> {
    return this.apiService.getTimeseriesData(spaceId, environmentName, applicationId, startTime, endTime)
      .catch((err: Response) => {
        let header: string = 'Cannot get initial application statistics';
        return this.handleHttpError(header, err);
      })
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

  private handleHttpError(header: string, response: Response): Observable<any> {
    let message: string;
    let type: NotificationType;

    if (response.status === 403 || response.status === 401) {
      message = 'Not authorized to access service';
      type = NotificationType.DANGER;
    } else if (response.status === 404) {
      message = 'Service unavailable. Please try again later';
      type = NotificationType.WARNING;
    } else if (response.status === 500) {
      message = 'Service error. Please try again later';
      type = NotificationType.WARNING;
    } else {
      message = 'Unknown error. Please try again later';
      type = NotificationType.DANGER;
    }

    this.notifications.message({
      type: type,
      header: header,
      message: message
    } as Notification);
    return Observable.empty();
  }
}
