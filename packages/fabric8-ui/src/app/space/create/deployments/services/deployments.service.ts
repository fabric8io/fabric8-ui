import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { flatten, has, includes, isEmpty, isEqual as deepEqual, round } from 'lodash';
import { NotificationType } from 'ngx-base';
import {
  combineLatest,
  empty,
  from,
  Observable,
  of,
  ReplaySubject,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import {
  bufferCount,
  catchError,
  concatMap,
  distinctUntilChanged,
  filter,
  finalize,
  first,
  map,
  mergeMap,
  pairwise,
  startWith,
  withLatestFrom,
} from 'rxjs/operators';
import { NotificationsService } from '../../../../shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { MemoryUnit, ordinal } from '../models/memory-unit';
import { NetworkStat } from '../models/network-stat';
import { PodPhase } from '../models/pod-phase';
import { Pods, PodsData } from '../models/pods';
import { CpuResourceUtilization, MemoryResourceUtilization } from '../models/resource-utilization';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
import { ScaledNetStat } from '../models/scaled-net-stat';
import {
  Application,
  CoresSeries,
  Deployment,
  DeploymentApiService,
  DeploymentAttributes,
  EnvironmentAttributes,
  EnvironmentQuota,
  EnvironmentStat,
  MemorySeries,
  MultiTimeseriesData,
  PodQuotaRequirement,
  PodsQuota,
  TimeseriesData,
} from './deployment-api.service';

export const TIMER_TOKEN: InjectionToken<Observable<void>> = new InjectionToken<Observable<void>>(
  'DeploymentsServiceTimer',
);
export const TIMESERIES_SAMPLES_TOKEN: InjectionToken<number> = new InjectionToken<number>(
  'DeploymentsServiceTimeseriesSamples',
);
export const POLL_RATE_TOKEN: InjectionToken<number> = new InjectionToken<number>(
  'DeploymentsServicePollRate',
);

@Injectable()
export class DeploymentsService implements OnDestroy {
  static readonly DEFAULT_INITIAL_UPDATE_DELAY: number = 0;
  static readonly DEFAULT_POLL_RATE_MS: number = 60000;
  static readonly DEFAULT_FRONT_LOAD_SAMPLES: number = 15;

  private readonly appsObservables: Map<string, Observable<Application[]>> = new Map<
    string,
    Observable<Application[]>
  >();
  private readonly envsObservables: Map<string, Observable<EnvironmentStat[]>> = new Map<
    string,
    Observable<EnvironmentStat[]>
  >();
  private readonly timeseriesSubjects: Map<string, Subject<TimeseriesData[]>> = new Map<
    string,
    Subject<TimeseriesData[]>
  >();
  private readonly podQuotaRequirements: Map<string, Subject<PodQuotaRequirement>> = new Map<
    string,
    Subject<PodQuotaRequirement>
  >();
  private readonly environmentResourceUtilization: Map<
    string,
    Subject<EnvironmentQuota[]>
  > = new Map<string, Subject<EnvironmentQuota[]>>();
  private readonly frontLoadWindowWidth: number;

  private readonly serviceSubscriptions: Subscription[] = [];

  constructor(
    private readonly apiService: DeploymentApiService,
    private readonly notifications: NotificationsService,
    @Inject(TIMER_TOKEN) private readonly pollTimer: Observable<void>,
    @Inject(TIMESERIES_SAMPLES_TOKEN) private readonly timeseriesSamples: number,
    @Inject(POLL_RATE_TOKEN) pollRate: number,
  ) {
    this.frontLoadWindowWidth = timeseriesSamples * pollRate;
  }

  ngOnDestroy(): void {
    this.serviceSubscriptions.forEach(
      (sub: Subscription): void => {
        sub.unsubscribe();
      },
    );
  }

  getApplications(spaceId: string): Observable<string[]> {
    return this.getApplicationsResponse(spaceId).pipe(
      map((apps: Application[]): Application[] => apps || []),
      map((apps: Application[]): string[] => apps.map((app: Application) => app.attributes.name)),
      distinctUntilChanged(deepEqual),
    );
  }

  getEnvironments(spaceId: string): Observable<string[]> {
    return this.getEnvironmentsResponse(spaceId).pipe(
      map((envs: EnvironmentStat[]): EnvironmentStat[] => envs || []),
      map(
        (envs: EnvironmentStat[]): EnvironmentAttributes[] =>
          envs.map((env: EnvironmentStat): EnvironmentAttributes => env.attributes),
      ),
      map(
        (envs: EnvironmentAttributes[]): string[] =>
          envs.map((env: EnvironmentAttributes): string => env.name),
      ),
      map(
        (envs: string[]): string[] =>
          envs.sort((a: string, b: string): number => b.localeCompare(a)),
      ),
      distinctUntilChanged(deepEqual),
    );
  }

  isApplicationDeployedInEnvironment(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<boolean> {
    return this.getApplication(spaceId, applicationId).pipe(
      map((app: Application): Deployment[] => app.attributes.deployments),
      map((deployments: Deployment[]): Deployment[] => deployments || []),
      map(
        (deployments: Deployment[]): boolean =>
          includes(deployments.map((d: Deployment): string => d.attributes.name), environmentName),
      ),
      distinctUntilChanged(),
    );
  }

  isDeployedInEnvironment(spaceId: string, environmentName: string): Observable<boolean> {
    return this.getApplicationsResponse(spaceId).pipe(
      map((apps: Application[]): Application[] => apps || []),
      map(
        (apps: Application[]): Deployment[][] =>
          apps.map((app: Application): Deployment[] => app.attributes.deployments || []),
      ),
      map(
        (deployments: Deployment[][]): string[][] =>
          deployments.map(
            (pipeline: Deployment[]): string[] =>
              pipeline.map((deployment: Deployment): string => deployment.attributes.name),
          ),
      ),
      map((pipeEnvNames: string[][]): string[] => flatten(pipeEnvNames)),
      map((envNames: string[]): boolean => includes(envNames, environmentName)),
      distinctUntilChanged(),
    );
  }

  hasDeployments(spaceId: string, environments: string[]): Observable<boolean> {
    return combineLatest(
      environments.map(
        (environment: string): Observable<boolean> =>
          this.isDeployedInEnvironment(spaceId, environment),
      ),
    ).pipe(map((deployed: boolean[]): boolean => deployed.some((b: boolean): boolean => b)));
  }

  getVersion(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): string => deployment.attributes.version),
      distinctUntilChanged(),
    );
  }

  canScale(spaceId: string, environmentName: string, applicationId: string): Observable<boolean> {
    return combineLatest(
      this.getEnvironmentCpuStat(spaceId, environmentName),
      this.getEnvironmentMemoryStat(spaceId, environmentName),
    ).pipe(
      withLatestFrom(this.getQuotaRequirementPerPod(spaceId, environmentName, applicationId)),
      map(
        (v: [[CpuStat, MemoryStat], PodQuotaRequirement]): boolean => {
          const cpuStat: CpuStat = v[0][0];
          const memStat: ScaledMemoryStat = ScaledMemoryStat.from(v[0][1], MemoryUnit.B);
          const quotaRequirement: PodQuotaRequirement = v[1];

          const cpuRemaining: number = cpuStat.quota - cpuStat.used;
          const memRemaining: number = memStat.quota - memStat.used;

          return (
            cpuRemaining >= quotaRequirement.cpucores && memRemaining >= quotaRequirement.memory
          );
        },
      ),
    );
  }

  // similar to canScale above, but is "one-shot" - emits one maximum value and completes. canScale provides ongoing status emissions.
  getMaximumPods(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<number> {
    return combineLatest(
      this.getEnvironmentCpuStat(spaceId, environmentName),
      this.getEnvironmentMemoryStat(spaceId, environmentName),
    ).pipe(
      first(),
      withLatestFrom(this.getQuotaRequirementPerPod(spaceId, environmentName, applicationId)),
      map(
        (v: [[CpuStat, MemoryStat], PodQuotaRequirement]): number => {
          const cpuQuota: CpuStat = v[0][0];
          const memQuota: MemoryStat = ScaledMemoryStat.from(v[0][1], MemoryUnit.B);
          const requirement: PodQuotaRequirement = v[1];

          const maxCpu: number = Math.floor(cpuQuota.quota / requirement.cpucores);
          const maxMem: number = Math.floor(memQuota.quota / requirement.memory);

          return Math.min(maxCpu, maxMem);
        },
      ),
    );
  }

  scalePods(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    desiredReplicas: number,
  ): Observable<string> {
    return this.apiService.scalePods(spaceId, environmentName, applicationId, desiredReplicas).pipe(
      map((): string => `Successfully scaled ${applicationId}`),
      catchError((): Observable<string> => throwError(`Failed to scale ${applicationId}`)),
    );
  }

  getPods(spaceId: string, environmentName: string, applicationId: string): Observable<Pods> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): DeploymentAttributes => deployment.attributes),
      map(
        (attrs: DeploymentAttributes): Pods => {
          const pods: PodsData[] = attrs.pods
            .sort(
              (a: [PodPhase, string], b: [PodPhase, string]): number => a[0].localeCompare(b[0]),
            )
            .map((entry: [PodPhase, string]): [PodPhase, number] => [entry[0], parseInt(entry[1])]);
          return {
            total: attrs.pod_total,
            pods,
          };
        },
      ),
      distinctUntilChanged(deepEqual),
    );
  }

  getPodsQuota(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<PodsQuota> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): DeploymentAttributes => deployment.attributes),
      filter((attrs: DeploymentAttributes): boolean => attrs && has(attrs, 'pods_quota')),
      map((attrs: DeploymentAttributes): PodsQuota => attrs.pods_quota),
      distinctUntilChanged(deepEqual),
    );
  }

  getDeploymentCpuStat(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    maxSamples: number = this.timeseriesSamples,
  ): Observable<CpuStat[]> {
    const series: Observable<CoresSeries[]> = this.getTimeseriesData(
      spaceId,
      environmentName,
      applicationId,
      maxSamples,
    ).pipe(
      filter(
        (t: TimeseriesData[]): boolean =>
          t && t.some((el: TimeseriesData): boolean => has(el, 'cores')),
      ),
      map(
        (t: TimeseriesData[]): CoresSeries[] => t.map((s: TimeseriesData): CoresSeries => s.cores),
      ),
    );
    const quota: Observable<number> = this.getPodsQuota(
      spaceId,
      environmentName,
      applicationId,
    ).pipe(
      map((podsQuota: PodsQuota): number => podsQuota.cpucores),
      distinctUntilChanged(),
    );
    return combineLatest(
      series,
      quota,
      (series: CoresSeries[], quota: number): CpuStat[] =>
        series.map(
          (s: CoresSeries): CpuStat => ({
            used: round(s.value, 4),
            quota: quota,
            timestamp: s.time,
          }),
        ),
    );
  }

  getDeploymentMemoryStat(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    maxSamples: number = this.timeseriesSamples,
  ): Observable<MemoryStat[]> {
    const series: Observable<MemorySeries[]> = this.getTimeseriesData(
      spaceId,
      environmentName,
      applicationId,
      maxSamples,
    ).pipe(
      filter(
        (t: TimeseriesData[]): boolean =>
          t && t.some((el: TimeseriesData): boolean => has(el, 'memory')),
      ),
      map(
        (t: TimeseriesData[]): MemorySeries[] =>
          t.map((s: TimeseriesData): MemorySeries => s.memory),
      ),
    );
    const quota: Observable<number> = this.getPodsQuota(
      spaceId,
      environmentName,
      applicationId,
    ).pipe(
      map((podsQuota: PodsQuota): number => podsQuota.memory),
      distinctUntilChanged(),
    );
    return combineLatest(
      series,
      quota,
      (memSeries: MemorySeries[], quota: number): MemoryStat[] => {
        const rawStats: ScaledMemoryStat[] = memSeries.map(
          (s: MemorySeries): ScaledMemoryStat => new ScaledMemoryStat(s.value, quota, s.time),
        );
        const greatestOrdinal: number = rawStats
          .map((stat: ScaledMemoryStat): MemoryUnit => stat.units)
          .map((unit: MemoryUnit): number => ordinal(unit))
          .reduce((acc: number, next: number): number => Math.max(acc, next));
        const greatestUnit: MemoryUnit = MemoryUnit[Object.keys(MemoryUnit)[greatestOrdinal]];
        return rawStats.map(
          (stat: ScaledMemoryStat): ScaledMemoryStat => ScaledMemoryStat.from(stat, greatestUnit),
        );
      },
    );
  }

  getDeploymentNetworkStat(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    maxSamples: number = this.timeseriesSamples,
  ): Observable<NetworkStat[]> {
    return this.getTimeseriesData(spaceId, environmentName, applicationId, maxSamples).pipe(
      filter(
        (t: TimeseriesData[]): boolean =>
          t &&
          t.some((el: TimeseriesData): boolean => has(el, 'net_tx')) &&
          t.some((el: TimeseriesData): boolean => has(el, 'net_rx')),
      ),
      map(
        (t: TimeseriesData[]): NetworkStat[] =>
          t.map(
            (s: TimeseriesData): NetworkStat => ({
              sent: new ScaledNetStat(s.net_tx.value, s.net_tx.time),
              received: new ScaledNetStat(s.net_rx.value, s.net_rx.time),
            }),
          ),
      ),
      map(
        (stats: NetworkStat[]): NetworkStat[] => {
          const greatestOrdinal: number = stats
            .map(
              (stat: NetworkStat): [MemoryUnit, MemoryUnit] => [
                stat.sent.units,
                stat.received.units,
              ],
            )
            .map(
              (units: [MemoryUnit, MemoryUnit]): number =>
                Math.max(ordinal(units[0]), ordinal(units[1])),
            )
            .reduce((acc: number, next: number): number => Math.max(acc, next));
          const greatestUnit: MemoryUnit = MemoryUnit[Object.keys(MemoryUnit)[greatestOrdinal]];

          return stats.map(
            (stat: NetworkStat): NetworkStat => ({
              sent: ScaledNetStat.from(stat.sent, greatestUnit),
              received: ScaledNetStat.from(stat.received, greatestUnit),
            }),
          );
        },
      ),
    );
  }

  // Reports usage per environment due to deployments within any space, not only the one specified
  getEnvironmentCpuStat(spaceId: string, environmentName: string): Observable<CpuStat> {
    return this.getEnvironment(spaceId, environmentName).pipe(
      map((env: EnvironmentStat): CpuStat => env.attributes.quota.cpucores),
    );
  }

  // Reports usage per environment due to deployments within any space, not only the one specified
  getEnvironmentMemoryStat(spaceId: string, environmentName: string): Observable<MemoryStat> {
    return this.getEnvironment(spaceId, environmentName).pipe(
      map(
        (env: EnvironmentStat): MemoryStat =>
          new ScaledMemoryStat(env.attributes.quota.memory.used, env.attributes.quota.memory.quota),
      ),
    );
  }

  // Reports utilization of resource for specified environment due to deployments in any space,
  // with utilization for the given space differentiated from utilization from all other spaces in aggregate
  getEnvironmentCpuUtilization(
    spaceId: string,
    environmentName: string,
  ): Observable<CpuResourceUtilization> {
    return this.getResourceUtilization(spaceId).pipe(
      map(
        (quotas: EnvironmentQuota[]): EnvironmentQuota =>
          quotas.filter((q: EnvironmentQuota): boolean => q.attributes.name === environmentName)[0],
      ),
      map(
        (eq: EnvironmentQuota): CpuResourceUtilization => {
          const currentCpu: number = eq.attributes.space_usage.cpucores;
          const othersCpu: number = eq.attributes.other_usage.cpucores.used;
          const quota: number = eq.attributes.other_usage.cpucores.quota;
          return {
            currentSpaceUsage: { used: currentCpu, quota },
            otherSpacesUsage: { used: othersCpu, quota },
          };
        },
      ),
    );
  }

  // Reports utilization of resource for specified environment due to deployments in any space,
  // with utilization for the given space differentiated from utilization from all other spaces in aggregate
  getEnvironmentMemoryUtilization(
    spaceId: string,
    environmentName: string,
  ): Observable<MemoryResourceUtilization> {
    return this.getResourceUtilization(spaceId).pipe(
      map(
        (quotas: EnvironmentQuota[]): EnvironmentQuota =>
          quotas.filter((q: EnvironmentQuota): boolean => q.attributes.name === environmentName)[0],
      ),
      map(
        (eq: EnvironmentQuota): MemoryResourceUtilization => {
          const currentMem: number = eq.attributes.space_usage.memory;
          const othersMem: number = eq.attributes.other_usage.memory.used;
          const quota: number = eq.attributes.other_usage.memory.quota;

          const combinedStat: MemoryStat = new ScaledMemoryStat(currentMem + othersMem, quota);
          const currentMemStat: MemoryStat = ScaledMemoryStat.from(
            new ScaledMemoryStat(currentMem, quota),
            combinedStat.units,
          );
          const othersMemStat: MemoryStat = ScaledMemoryStat.from(
            new ScaledMemoryStat(othersMem, quota),
            combinedStat.units,
          );
          return {
            currentSpaceUsage: currentMemStat,
            otherSpacesUsage: othersMemStat,
          };
        },
      ),
    );
  }

  getLogsUrl(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): string => deployment.links.logs),
    );
  }

  getConsoleUrl(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): string => deployment.links.console),
    );
  }

  getAppUrl(spaceId: string, environmentName: string, applicationId: string): Observable<string> {
    return this.getDeployment(spaceId, environmentName, applicationId).pipe(
      map((deployment: Deployment): string => deployment.links.application),
    );
  }

  deleteDeployment(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<string> {
    return this.apiService.deleteDeployment(spaceId, environmentName, applicationId).pipe(
      map((): string => `Deployment has successfully deleted`),
      catchError(
        (): Observable<string> =>
          throwError(`Failed to delete ${applicationId} in ${spaceId} (${environmentName})`),
      ),
    );
  }

  private getApplicationsResponse(spaceId: string): Observable<Application[]> {
    if (!this.appsObservables.has(spaceId)) {
      const subject: Subject<Application[]> = new ReplaySubject<Application[]>(1);
      const observable: Observable<Application[]> = this.pollTimer.pipe(
        concatMap(
          (): Observable<Application[]> =>
            this.apiService.getApplications(spaceId).pipe(
              catchError(
                (err: Response): Observable<Application[]> => {
                  const header: string = 'Cannot get applications';
                  return this.handleHttpError(header, err);
                },
              ),
            ),
        ),
      );
      this.serviceSubscriptions.push(observable.subscribe(subject));
      this.appsObservables.set(spaceId, subject);
    }
    return this.appsObservables.get(spaceId);
  }

  private getApplication(spaceId: string, applicationId: string): Observable<Application> {
    // does not emit if there are no applications matching the specified name
    return this.getApplicationsResponse(spaceId).pipe(
      mergeMap((apps: Application[]): Application[] => apps || []),
      filter((app: Application): boolean => app.attributes.name === applicationId),
    );
  }

  private getDeployment(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<Deployment> {
    // does not emit if there are no applications or environments matching the specified names
    return this.getApplication(spaceId, applicationId).pipe(
      mergeMap((app: Application): Deployment[] => app.attributes.deployments || []),
      filter((deployment: Deployment): boolean => deployment.attributes.name === environmentName),
    );
  }

  private getEnvironmentsResponse(spaceId: string): Observable<EnvironmentStat[]> {
    if (!this.envsObservables.has(spaceId)) {
      const subject: Subject<EnvironmentStat[]> = new ReplaySubject<EnvironmentStat[]>(1);
      const observable: Observable<EnvironmentStat[]> = this.pollTimer.pipe(
        concatMap(
          (): Observable<EnvironmentStat[]> =>
            this.apiService.getEnvironments(spaceId).pipe(
              catchError(
                (err: Response): Observable<EnvironmentStat[]> => {
                  const header: string = 'Cannot get environments';
                  return this.handleHttpError(header, err);
                },
              ),
            ),
        ),
      );
      this.serviceSubscriptions.push(observable.subscribe(subject));
      this.envsObservables.set(spaceId, subject);
    }
    return this.envsObservables.get(spaceId);
  }

  private getEnvironment(spaceId: string, environmentName: string): Observable<EnvironmentStat> {
    // does not emit if there are no environments matching the specified name
    return this.getEnvironmentsResponse(spaceId).pipe(
      mergeMap((envs: EnvironmentStat[]): EnvironmentStat[] => envs || []),
      filter((env: EnvironmentStat): boolean => env.attributes.name === environmentName),
    );
  }

  private getTimeseriesData(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    maxSamples: number,
  ): Observable<TimeseriesData[]> {
    const key: string = DeploymentsService.makeCacheKey(spaceId, environmentName, applicationId);
    if (!this.timeseriesSubjects.has(key)) {
      const subject: Subject<TimeseriesData[]> = new ReplaySubject<TimeseriesData[]>(
        this.timeseriesSamples,
      );

      const now: number = +Date.now();
      const seriesData: Observable<TimeseriesData[]> = this.getStreamingTimeseriesData(
        spaceId,
        environmentName,
        applicationId,
        now - this.frontLoadWindowWidth,
        now,
      ).pipe(
        finalize(
          (): void => {
            this.timeseriesSubjects.delete(key);
          },
        ),
        bufferCount(this.timeseriesSamples, 1),
      );

      this.serviceSubscriptions.push(seriesData.subscribe(subject));
      this.timeseriesSubjects.set(key, subject);
    }
    return this.timeseriesSubjects.get(key).pipe(
      map(
        (data: TimeseriesData[]): TimeseriesData[] => {
          if (maxSamples >= data.length) {
            return data;
          }
          return data.slice(data.length - maxSamples);
        },
      ),
    );
  }

  private getStreamingTimeseriesData(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    startTime: number,
    endTime: number,
  ): Observable<TimeseriesData> {
    return combineLatest(
      this.isApplicationDeployedInEnvironment(spaceId, environmentName, applicationId),
      this.getPods(spaceId, environmentName, applicationId).pipe(map((p: Pods): number => p.total)),
      this.pollTimer.pipe(startWith(null)),
    ).pipe(
      startWith([false, 0, null]),
      pairwise(),
      concatMap(
        (status: [(number | boolean)[], (number | boolean)[]]): Observable<TimeseriesData> => {
          const prev: (number | boolean)[] = status[0];
          const curr: (number | boolean)[] = status[1];

          const isDeployed: boolean = curr[0] && curr[1] > 0;
          const wasDeployed: boolean = prev[0] && prev[1] > 0;

          if (!isDeployed) {
            return empty();
          }

          if (!wasDeployed) {
            return this.getInitialTimeseriesData(
              spaceId,
              environmentName,
              applicationId,
              startTime,
              endTime,
            );
          } else {
            return this.apiService
              .getLatestTimeseriesData(spaceId, environmentName, applicationId)
              .pipe(
                catchError(
                  (err: Response): Observable<TimeseriesData> => {
                    const header: string = 'Cannot get latest application statistics';
                    return this.handleHttpError(header, err);
                  },
                ),
                filter((t: TimeseriesData): boolean => !!t && !isEmpty(t)),
              );
          }
        },
      ),
    );
  }

  private getInitialTimeseriesData(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    startTime: number,
    endTime: number,
  ): Observable<TimeseriesData> {
    return this.apiService
      .getTimeseriesData(spaceId, environmentName, applicationId, startTime, endTime)
      .pipe(
        catchError(
          (err: Response): Observable<TimeseriesData> => {
            const header: string = 'Cannot get initial application statistics';
            return this.handleHttpError(header, err);
          },
        ),
        filter((t: MultiTimeseriesData): boolean => !!t && !isEmpty(t)),
        concatMap(
          (t: MultiTimeseriesData): Observable<TimeseriesData> => {
            const results: TimeseriesData[] = [];
            const numSamples = t.cores.length;
            for (let i = 0; i < numSamples; i++) {
              results.push({
                cores: {
                  time: t.cores[i].time,
                  value: t.cores[i].value,
                },
                memory: {
                  time: t.memory[i].time,
                  value: t.memory[i].value,
                },
                net_tx: {
                  time: t.net_tx[i].time,
                  value: t.net_tx[i].value,
                },
                net_rx: {
                  time: t.net_rx[i].time,
                  value: t.net_rx[i].value,
                },
              });
            }
            return from(results);
          },
        ),
      );
  }

  private getQuotaRequirementPerPod(
    spaceId: string,
    environmentName: string,
    applicationId: string,
  ): Observable<PodQuotaRequirement> {
    const key: string = DeploymentsService.makeCacheKey(spaceId, environmentName, applicationId);
    if (!this.podQuotaRequirements.has(key)) {
      const subj: Subject<PodQuotaRequirement> = new ReplaySubject<PodQuotaRequirement>(1);
      this.podQuotaRequirements.set(key, subj);
      this.apiService
        .getQuotaRequirementPerPod(spaceId, environmentName, applicationId)
        .pipe(
          catchError(
            (): Observable<PodQuotaRequirement> => {
              // 1 core/512MB is the default allocation on the backend
              const gb: number = Math.pow(1024, 3);
              return of({
                cpucores: 1,
                memory: 0.5 * gb,
              });
            },
          ),
        )
        .subscribe(subj);
    }
    return this.podQuotaRequirements.get(key).asObservable();
  }

  private getResourceUtilization(spaceId: string): Observable<EnvironmentQuota[]> {
    const key: string = DeploymentsService.makeCacheKey(spaceId);
    if (!this.environmentResourceUtilization.has(key)) {
      const subj: Subject<EnvironmentQuota[]> = new ReplaySubject<EnvironmentQuota[]>(1);
      this.environmentResourceUtilization.set(key, subj);
      this.apiService
        .getQuotas(spaceId)
        .pipe(
          catchError(
            (err: Response): Observable<TimeseriesData> => {
              const header: string = 'Cannot get environment resource utilization';
              return this.handleHttpError(header, err);
            },
          ),
        )
        .subscribe(subj);
    }
    return this.environmentResourceUtilization.get(key).asObservable();
  }

  static makeCacheKey(...ids: string[]): string {
    return ids.join(':');
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
      message: message,
    });
    return empty();
  }
}
