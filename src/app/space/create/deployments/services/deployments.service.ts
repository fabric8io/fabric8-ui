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
  BehaviorSubject,
  Observable
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
import { Pods } from '../models/pods';
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

export interface Applications {
  applications: Application[];
}

export interface Application {
  name: string;
  pipeline: Environment[];
}

export interface Environment {
  name: string;
}

export interface EnvironmentStat {
  name: string;
}

@Injectable()
export class DeploymentsService {

  static readonly INITIAL_UPDATE_DELAY: number = 0;
  static readonly POLL_RATE_MS: number = 30000;

  headers: Headers = new Headers({ 'Content-Type': 'application/json' });
  apiUrl: string;

  private readonly appsObservables = new Map<string, Observable<Applications>>();
  private readonly envsObservables = new Map<string, Observable<EnvironmentStat[]>>();

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
      .map((resp: Applications) => resp.applications.map((app: Application) => app.name))
      .distinctUntilChanged(deepEqual);
  }

  getEnvironments(spaceId: string): Observable<Environment[]> {
    return this.getEnvironmentsResponse(spaceId)
      .map((envs: EnvironmentStat[]) => envs.map((env: EnvironmentStat) => ({ name: env.name} as ModelEnvironment)))
      .distinctUntilChanged((p: ModelEnvironment[], q: ModelEnvironment[]) =>
        deepEqual(new Set<string>(p.map(v => v.name)), new Set<string>(q.map(v => v.name))));
  }

  isApplicationDeployedInEnvironment(spaceId: string, applicationName: string, environmentName: string):
    Observable<boolean> {
    return this.getApplication(spaceId, applicationName)
      .map((app: Application) => app.pipeline)
      .map((pipe: Environment[]) => includes(pipe.map((p: Environment) => p.name), environmentName));
  }

  isDeployedInEnvironment(spaceId: string, environmentName: string):
    Observable<boolean> {
    return this.getApplicationsResponse(spaceId)
      .map((apps: Applications) => apps.applications)
      .map((apps: Application[]) => apps.map((app: Application) => app.pipeline))
      .map((pipes: Environment[][]) => pipes.map((pipe: Environment[]) => pipe.map((env: Environment) => env.name)))
      .map((pipeEnvNames: string[][]) => flatten(pipeEnvNames))
      .map((envNames: string[]) => includes(envNames, environmentName));
  }

  getVersion(spaceId: string, environmentName: string): Observable<string> {
    return Observable.of('1.0.2');
  }

  scalePods(
    spaceId: string,
    environmentName: string,
    applicationId: string,
    desiredReplicas: number
  ): Observable<string> {
    return Observable.of(`Scaled ${applicationId} in ${spaceId}/${environmentName} to ${desiredReplicas} replicas`);
  }

  getPods(spaceId: string, applicationId: string, environmentName: string): Observable<Pods> {
    return Observable.of({ pods: [['Running', 2], ['Terminating', 1]], total: 3 } as Pods);
  }

  getDeploymentCpuStat(spaceId: string, applicationName: string, environmentName: string): Observable<CpuStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, quota: 10 } as CpuStat))
      .startWith({ used: 3, quota: 10 } as CpuStat);
  }

  getDeploymentMemoryStat(spaceId: string, applicationName: string, environmentName: string): Observable<MemoryStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => (new ScaledMemoryStat(Math.floor(Math.random() * 156) + 100, 256)))
      .startWith(new ScaledMemoryStat(200, 256));
  }

  getEnvironmentCpuStat(spaceId: string, environmentName: string): Observable<CpuStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, quota: 10 } as CpuStat))
      .startWith({ used: 3, quota: 10 } as CpuStat);
  }

  getEnvironmentMemoryStat(spaceId: string, environmentName: string): Observable<MemoryStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => (new ScaledMemoryStat(Math.floor(Math.random() * 156) + 100, 256)))
      .startWith(new ScaledMemoryStat(200, 256));
  }

  getDeploymentNetworkStat(spaceId: string, applicationId: string, environmentName: string): Observable<NetworkStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ sent: round(Math.random() * 100, 1), received: round(Math.random() * 100, 1) }))
      .startWith({ sent: 0, received: 0});
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
      const emptyResponse: Applications = { applications: [] };
      const subject = new BehaviorSubject<Applications>(emptyResponse);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId, { headers: this.headers })
            .map((response: Response) => (response.json() as ApplicationsResponse).data)
            .catch(() => Observable.of(emptyResponse))
        );
      observable.subscribe(subject);
      this.appsObservables.set(spaceId, subject);
    }
    return this.appsObservables.get(spaceId);
  }

  private getApplication(spaceId: string, applicationName: string): Observable<Application> {
    return this.getApplicationsResponse(spaceId)
      .flatMap((apps: Applications) => apps.applications)
      .filter((app: Application) => app.name === applicationName);
  }

  private getEnvironmentsResponse(spaceId: string): Observable<EnvironmentStat[]> {
    if (!this.envsObservables.has(spaceId)) {
      const emptyResponse: EnvironmentStat[] = [];
      const subject = new BehaviorSubject<EnvironmentStat[]>(emptyResponse);
      const observable = this.pollTimer
        .concatMap(() =>
          this.http.get(this.apiUrl + spaceId + '/environments', { headers: this.headers })
            .map((response: Response) => (response.json() as EnvironmentsResponse).data)
            .catch(() => Observable.of(emptyResponse))
        );
      observable.subscribe(subject);
      this.envsObservables.set(spaceId, subject);
    }
    return this.envsObservables.get(spaceId);
  }

}
