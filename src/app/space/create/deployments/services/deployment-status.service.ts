import { Injectable } from '@angular/core';

import {
  last,
  reduce
} from 'lodash';
import { Observable } from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
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

  static readonly WARNING_THRESHOLD = .6;

  constructor(private readonly deploymentsService: DeploymentsService) { }

  getCpuStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return this.deploymentsService.getDeploymentCpuStat(spaceId, applicationName, environmentName, 1)
      .map((stats: CpuStat[]): Status => this.getStatStatus(last(stats), 'CPU'));
  }

  getMemoryStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return this.deploymentsService.getDeploymentMemoryStat(spaceId, applicationName, environmentName, 1)
      .map((stats: MemoryStat[]): Status => this.getStatStatus(last(stats), 'Memory'));
  }

  getAggregateStatus(spaceId: string, environmentName: string, applicationName: string): Observable<Status> {
    return Observable.combineLatest(
      this.getCpuStatus(spaceId, environmentName, applicationName),
      this.getMemoryStatus(spaceId, environmentName, applicationName)
    ).map((statuses: [Status, Status]): Status => {
      const maxType: StatusType = statuses
        .map((status: Status): StatusType => status.type)
        .reduce((accum: StatusType, next: StatusType): StatusType => Math.max(accum, next));
      const joinedMessage: string = statuses
        .map((status: Status): string => status.message)
        .join(' ')
        .trim();
      return {
        type: maxType,
        message: joinedMessage
      };
    });
  }

  private getStatStatus(stat: Stat, metricName: string): Status {
    let type: StatusType;
    let message: string;
    if (stat.used >= stat.quota) {
      type = StatusType.ERR;
      message = `${metricName} usage has reached capacity.`;
    } else if (stat.used / stat.quota >= DeploymentStatusService.WARNING_THRESHOLD) {
      type = StatusType.WARN;
      message = `${metricName} usage is nearing capacity.`;
    } else {
      type = StatusType.OK;
      message = '';
    }
    return {
      type: type,
      message: message
    };
  }

}
