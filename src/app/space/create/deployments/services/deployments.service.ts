import {
  Inject,
  Injectable
} from '@angular/core';

import { round } from 'lodash';

import {
  Headers,
  Http,
  Response
} from '@angular/http';

import {
  Observable,
  ReplaySubject
} from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';

import { WIT_API_URL } from 'ngx-fabric8-wit';

import {
  flatten,
  includes,
  isEqual as deepEqual
} from 'lodash';

import { CpuStat } from '../models/cpu-stat';
import { Environment as ModelEnvironment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { Pods as ModelPods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';

export interface NetworkStat {
  sent: number;
  received: number;
}

export interface ApplicationsResponse {
  data: Applications;
}

export interface EnvironmentsResponse {
  data: EnvironmentStat[];
}

export interface TimeseriesResponse {
  data: TimeseriesData;
}

export interface Applications {
  applications: Application[];
}

export interface Application {
  name: string;
  pipeline: Environment[];
}

export interface Environment {
  name: string;
  pods: Pods;
  version: string;
}

export interface EnvironmentStat {
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

export interface TimeseriesData {
  cores: CoresSeries;
  memory: MemorySeries;
}

export interface CoresSeries extends SeriesData { }

export interface MemorySeries extends SeriesData { }

export interface SeriesData {
  time: number;
  value: number;
}

@Injectable()
export class DeploymentsService {

  static readonly INITIAL_UPDATE_DELAY: number = 0;
  static readonly POLL_RATE_MS: number = 30000;

  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  apiUrl: string;

  private readonly appsObservables = new Map<string, Observable<Applications>>();
  private readonly envsObservables = new Map<string, Observable<EnvironmentStat[]>>();
  private readonly timeseriesObservables = new Map<string, Observable<TimeseriesData>>();

  private readonly pollTimer = Observable
    .timer(DeploymentsService.INITIAL_UPDATE_DELAY, DeploymentsService.POLL_RATE_MS)
    .share();

  constructor(
    public http: Http,
    public auth: AuthenticationService,
    @Inject(WIT_API_URL) witUrl: string
  ) {
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
    this.apiUrl = witUrl + 'apps/spaces/';
  }

  getApplications(spaceId: string): Observable<string[]> {
    return this.getApplicationsResponse(spaceId)
      .map((resp: Applications) => resp.applications)
      .map((apps: Application[]) => apps || [])
      .map((apps: Application[]) => apps.map((app: Application) => app.name))
      .distinctUntilChanged(deepEqual);
  }

  getEnvironments(spaceId: string): Observable<ModelEnvironment[]> {
    return this.getEnvironmentsResponse(spaceId)
      .map((envs: EnvironmentStat[]) => envs ? envs.sort((a, b) =>  -1 * a.name.localeCompare(b.name)) : [])
      .map((envs: EnvironmentStat[]) => envs
        .filter((env: EnvironmentStat) => env.name !== 'test')
        .map((env: EnvironmentStat) => ({ name: env.name} as ModelEnvironment))
      )
      .distinctUntilChanged((p: ModelEnvironment[], q: ModelEnvironment[]) =>
        deepEqual(new Set<string>(p.map(v => v.name)), new Set<string>(q.map(v => v.name))));
  }

  isApplicationDeployedInEnvironment(spaceId: string, applicationName: string, environmentName: string):
    Observable<boolean> {
    return this.getApplication(spaceId, applicationName)
      .map((app: Application) => app.pipeline)
      .map((pipe: Environment[]) => pipe || [])
      .map((pipe: Environment[]) => includes(pipe.map((p: Environment) => p.name), environmentName))
      .distinctUntilChanged();
  }

  isDeployedInEnvironment(spaceId: string, environmentName: string):
    Observable<boolean> {
    return this.getApplicationsResponse(spaceId)
      .map((apps: Applications) => apps.applications)
      .map((apps: Application[]) => apps || [])
      .map((apps: Application[]) => apps.map((app: Application) => app.pipeline || []))
      .map((pipes: Environment[][]) => pipes.map((pipe: Environment[]) => pipe.map((env: Environment) => env.name)))
      .map((pipeEnvNames: string[][]) => flatten(pipeEnvNames))
      .map((envNames: string[]) => includes(envNames, environmentName))
      .distinctUntilChanged();
  }

  getVersion(spaceId: string, applicationName: string, environmentName: string): Observable<string> {
    return this.getDeployment(spaceId, applicationName, environmentName)
      .map((env: Environment) => env.version)
      .distinctUntilChanged();
  }

  scalePods(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    desiredReplicas: number
  ): Observable<string> {
    const url = `${this.apiUrl}${spaceId}/applications/${applicationId}/deployments/${environmentName}/control?podCount=${desiredReplicas}`;
    return this.http.put(url, '')
      .map((r: Response) => { return `Successfully scaled ${applicationId}`; })
      .catch(err => Observable.throw(`Failed to scale ${applicationId}`));
  }

  getPods(spaceId: string, applicationId: string, environmentName: string): Observable<ModelPods> {
    return this.getDeployment(spaceId, applicationId, environmentName)
      .map((env: Environment) => env.pods)
      .map((pods: Pods) => {
        return {
          total: pods.total,
          pods: [
            [ 'Running', pods.running ],
            [ 'Starting', pods.starting ],
            [ 'Stopping', pods.stopping ]
          ]
        } as ModelPods;
      })
      .distinctUntilChanged(deepEqual);
  }

  getDeploymentCpuStat(spaceId: string, applicationName: string, environmentName: string): Observable<CpuStat> {
    const series = this.getTimeseriesData(spaceId, applicationName, environmentName)
      .map((t: TimeseriesData) => t.cores);
    const quota = this.getEnvironmentCpuStat(spaceId, environmentName)
      .map((stat: CpuStat) => stat.quota);

      // TODO: propagate CoresSeries timestamp to caller
      return Observable.combineLatest(series, quota, (series: CoresSeries, quota: number) => ({ used: series.value, quota: quota }));
  }

  getDeploymentMemoryStat(spaceId: string, applicationName: string, environmentName: string): Observable<MemoryStat> {
    const series = this.getTimeseriesData(spaceId, applicationName, environmentName)
      .map((t: TimeseriesData) => t.memory);
    const quota = this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => env.quota.memory.quota);

      // TODO: propagate MemorySeries timestamp to caller
      return Observable.combineLatest(series, quota, (series: MemorySeries, quota: number) => new ScaledMemoryStat(series.value, quota));
  }

  getDeploymentNetworkStat(spaceId: string, applicationId: string, environmentName: string): Observable<NetworkStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ sent: round(Math.random() * 100, 1), received: round(Math.random() * 100, 1) }))
      .startWith({ sent: 0, received: 0});
  }

  getEnvironmentCpuStat(spaceId: string, environmentName: string): Observable<CpuStat> {
    return this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => env.quota.cpucores);
  }

  getEnvironmentMemoryStat(spaceId: string, environmentName: string): Observable<MemoryStat> {
    return this.getEnvironment(spaceId, environmentName)
      .map((env: EnvironmentStat) => new ScaledMemoryStat(env.quota.memory.used, env.quota.memory.quota));
  }

  getLogsUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return Observable.of('http://example.com/');
  }

  getConsoleUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    return Observable.of('http://example.com/');
  }

  getAppUrl(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    if (Math.random() > 0.5) {
      return Observable.of('http://example.com/');
    } else {
      return Observable.of('');
    }
  }

  deleteApplication(spaceId: string, applicationId: string, environmentName: string): Observable<string> {
    if (Math.random() > 0.5) {
      return Observable.of(`Deleted ${applicationId} in ${spaceId} (${environmentName})`);
    } else {
      return Observable.throw(`Failed to delete ${applicationId} in ${spaceId} (${environmentName})`);
    }
  }

  private getApplicationsResponse(spaceId: string): Observable<Applications> {
    if (!this.appsObservables.has(spaceId)) {
      const subject = new ReplaySubject<Applications>(1);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId, { headers: this.headers })
            .map((response: Response) => (response.json() as ApplicationsResponse).data)
            .catch(() => Observable.of({ applications: [] }))
        );
      observable.subscribe(subject);
      this.appsObservables.set(spaceId, subject);
    }
    return this.appsObservables.get(spaceId);
  }

  private getApplication(spaceId: string, applicationName: string): Observable<Application> {
    // does not emit if there are no applications matching the specified name
    return this.getApplicationsResponse(spaceId)
      .flatMap((apps: Applications) => apps.applications || [])
      .filter((app: Application) => app.name === applicationName);
  }

  private getDeployment(spaceId: string, applicationName: string, environmentName: string): Observable<Environment> {
    // does not emit if there are no applications or environments matching the specified names
    return this.getApplication(spaceId, applicationName)
      .flatMap((app: Application) => app.pipeline || [])
      .filter((env: Environment) => env.name === environmentName);
  }

  private getEnvironmentsResponse(spaceId: string): Observable<EnvironmentStat[]> {
    if (!this.envsObservables.has(spaceId)) {
      const subject = new ReplaySubject<EnvironmentStat[]>(1);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId + '/environments', { headers: this.headers })
            .map((response: Response) => (response.json() as EnvironmentsResponse).data)
            .catch(() => Observable.of([]))
        );
      observable.subscribe(subject);
      this.envsObservables.set(spaceId, subject);
    }
    return this.envsObservables.get(spaceId);
  }

  private getEnvironment(spaceId: string, environmentName: string): Observable<EnvironmentStat> {
    // does not emit if there are no environments matching the specified name
    return this.getEnvironmentsResponse(spaceId)
      .flatMap((envs: EnvironmentStat[]) => envs || [])
      .filter((env: EnvironmentStat) => env.name === environmentName);
  }

  private getTimeseriesData(spaceId: string, applicationId: string, environmentName: string): Observable<TimeseriesData> {
    const currentTime = +Date.now();
    const emptyResult: TimeseriesData = {
      cores: {
        time: currentTime,
        value: 0
      },
      memory: {
        time: currentTime,
        value: 0
      }
    };

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
                  .map((response: Response) => (response.json() as TimeseriesResponse).data)
                  .catch(() => Observable.of(emptyResult))
              );
            observable.subscribe(subject);
            this.timeseriesObservables.set(key, subject);
          }
          return this.timeseriesObservables.get(key);
        } else {
          return Observable.of(emptyResult);
        }
      });
  }

}
