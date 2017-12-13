import {
  Injectable,
  InjectionToken
} from '@angular/core';
import { Observable } from 'rxjs';
import { Environment } from '../models/environment';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

@Injectable()
export class DeploymentsService {
  static readonly POLL_RATE_MS: number = 5000;

  getApplications(spaceId: string): Observable<string[]> {
    return Observable.of(['vertx-hello', 'vertx-paint', 'vertx-wiki']);
  }

  getEnvironments(spaceId: string): Observable<Environment[]> {
    return Observable.of([
      { environmentId: 'envId-stage', name: 'stage' } as Environment,
      { environmentId: 'envId-run', name: 'run' } as Environment
    ]);
  }

  getPodCount(spaceId: string, environmentId: string): Observable<number> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => Math.floor(Math.random() * 5) + 1);
  }

  getVersion(spaceId: string, environmentId: string): Observable<string> {
    return Observable.of('1.0.2');
  }

  getCpuStat(spaceId: string, environmentId: string): Observable<CpuStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 9) + 1, total: 10 } as CpuStat))
      .startWith({ used: 3, total: 10 } as CpuStat);
  }

  getMemoryStat(spaceId: string, environmentId: string): Observable<MemoryStat> {
    return Observable
      .interval(DeploymentsService.POLL_RATE_MS)
      .distinctUntilChanged()
      .map(() => ({ used: Math.floor(Math.random() * 156) + 100, total: 256 } as MemoryStat))
      .startWith({ used: 200, total: 256 } as MemoryStat);
  }

  getLogsUrl(spaceId: string, applicationId: string, environmentId: string): Observable<string> {
    return Observable.of('http://example.com/');
  }

  getConsoleUrl(spaceId: string, applicationId: string, environmentId: string): Observable<string> {
    return Observable.of('http://example.com/');
  }

  getAppUrl(spaceId: string, applicationId: string, environmentId: string): Observable<string> {
    if (Math.random() > 0.5) {
      return Observable.of('http://example.com/');
    } else {
      return Observable.of('');
    }
  }

  deleteApplication(spaceId: string, applicationId: string, environmentId: string): Observable<string> {
    return Observable.of(`Deleted ${applicationId} in ${spaceId} (${environmentId})`);
  }

}
