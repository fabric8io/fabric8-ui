import { Injectable } from '@angular/core';

import { last } from 'lodash';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { map } from 'rxjs/operators/map';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { Pods } from '../models/pods';
import { Stat } from '../models/stat';
import { DeploymentsService } from './deployments.service';

export enum StatusType {
  OK,
  WARN,
  ERR
}

export interface Status {
  type: StatusType;
  message: string;
}

@Injectable()
export class DeploymentStatusService {

  private static readonly WARNING_THRESHOLD: number = .6;
  private static readonly OK_STATUS: Status = { type: StatusType.OK, message: '' };

  constructor(private readonly deploymentsService: DeploymentsService) { }

  getDeploymentCpuStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return this.adjustStatusForPods(
      this.deploymentsService.getPods(spaceId, environmentName, applicationName),
      this.deploymentsService.getDeploymentCpuStat(spaceId, environmentName, applicationName, 1).pipe(
        map((stats: CpuStat[]): Status => this.getStatStatus(last(stats), 'CPU'))
      )
    );
  }

  getDeploymentMemoryStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return this.adjustStatusForPods(
      this.deploymentsService.getPods(spaceId, environmentName, applicationName),
      this.deploymentsService.getDeploymentMemoryStat(spaceId, environmentName, applicationName, 1).pipe(
        map((stats: MemoryStat[]): Status => this.getStatStatus(last(stats), 'Memory'))
      )
    );
  }

  getDeploymentAggregateStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return combineLatest(
      this.getDeploymentCpuStatus(spaceId, environmentName, applicationName),
      this.getDeploymentMemoryStatus(spaceId, environmentName, applicationName)
    ).pipe(
      map((statuses: [Status, Status]): Status => {
        const type: StatusType = statuses
          .map((status: Status): StatusType => status.type)
          .reduce((accum: StatusType, next: StatusType): StatusType => Math.max(accum, next));
        const message: string = statuses
          .map((status: Status): string => status.message)
          .join(' ')
          .trim();
        return { type, message };
      })
    );
  }

  getEnvironmentCpuStatus(spaceId: string, environmentName: string): Observable<Status> {
    return this.deploymentsService
      .getEnvironmentCpuStat(spaceId, environmentName).pipe(
        map((stat: CpuStat): Status => this.getStatStatus(stat, 'CPU'))
      );
  }

  getEnvironmentMemoryStatus(spaceId: string, environmentName: string): Observable<Status> {
    return this.deploymentsService
      .getEnvironmentMemoryStat(spaceId, environmentName).pipe(
        map((stat: MemoryStat): Status => this.getStatStatus(stat, 'Memory'))
      );
  }

  private adjustStatusForPods(pods: Observable<Pods>, status: Observable<Status>): Observable<Status> {
    return combineLatest(pods, status).pipe(
      map((val: [Pods, Status]): Status => {
        if (val[0].total === 0) {
          return Object.assign({}, DeploymentStatusService.OK_STATUS);
        }
        return val[1];
      })
    );
  }

  private getStatStatus(stat: Stat, metricName: string): Status {
    let status: Status = Object.assign({}, DeploymentStatusService.OK_STATUS);
    if (stat.used >= stat.quota) {
      status.type = StatusType.ERR;
      status.message = `${metricName} usage has reached capacity.`;
    } else if (stat.used / stat.quota >= DeploymentStatusService.WARNING_THRESHOLD) {
      status.type = StatusType.WARN;
      status.message = `${metricName} usage is nearing capacity.`;
    }
    return status;
  }

}
