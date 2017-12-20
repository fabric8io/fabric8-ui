import {
  Injectable,
  InjectionToken
} from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../models/environment';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { Pods } from '../models/pods';

@Injectable()
export class DeploymentsService {
  static readonly POLL_RATE_MS: number = 5000;

  getApplications(spaceId: string): Observable<string[]> {
    return Observable.of(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
  }

  getEnvironments(spaceId: string): Observable<Environment[]> {
    return Observable.of([
      { name: 'stage' } as Environment,
      { name: 'run' } as Environment
    ]);
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

  getCpuStat(spaceId: string, environmentName: string): Observable<CpuStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, quota: 10 } as CpuStat))
      .startWith({ used: 3, quota: 10 } as CpuStat);
  }

  getMemoryStat(spaceId: string, environmentName: string): Observable<MemoryStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 156) + 100, quota: 256, units: 'MB' } as MemoryStat))
      .startWith({ used: 200, quota: 256, units: 'MB' } as MemoryStat);
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
    return Observable.of(`Deleted ${applicationId} in ${spaceId} (${environmentName})`);
  }

}
