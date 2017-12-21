import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs';
import { uniqueId } from 'lodash';

import {
  Notification,
  NotificationType
} from 'ngx-base';

import { NotificationsService } from 'app/shared/notifications.service';

import { DeploymentsService } from '../services/deployments.service';
import { Environment } from '../models/environment';
import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';

// Makes patternfly charts available
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html',
  styleUrls: ['./deployment-card.component.less']
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  public cpuData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 0],
    yData: ['used', 1]
  };

  public memData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 0],
    yData: ['used', 1]
  };

  public cpuConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('cpu-chart-') + '-'
  };

  public memConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart-') + '-'
  };

  collapsed: boolean = true;
  version: Observable<string>;
  cpuStat: Observable<CpuStat>;
  memStat: Observable<MemoryStat>;
  cpuTime: number;
  memTime: number;
  cpuVal: number;
  cpuMax: number;
  memVal: number;
  memUnits: string;
  memMax: number;

  logsUrl: Observable<string>;
  consoleUrl: Observable<string>;
  appUrl: Observable<string>;

  subscriptions: Array<Subscription> = [];

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.cpuConfig.chartHeight = 100;
    this.memConfig.chartHeight = 100;
    this.cpuTime = 1;
    this.memTime = 1;

    this.version =
      this.deploymentsService.getVersion(this.applicationId, this.environment.name);

    this.logsUrl =
      this.deploymentsService.getLogsUrl(this.spaceId, this.applicationId, this.environment.name);

    this.consoleUrl =
      this.deploymentsService.getConsoleUrl(this.spaceId, this.applicationId, this.environment.name);

    this.appUrl =
      this.deploymentsService.getAppUrl(this.spaceId, this.applicationId, this.environment.name);

    this.cpuStat =
      this.deploymentsService.getCpuStat(this.applicationId, this.environment.name);

    this.memStat =
      this.deploymentsService.getMemoryStat(this.applicationId, this.environment.name);

    this.subscriptions.push(this.cpuStat.subscribe(stat => {
      this.cpuVal = stat.used;
      this.cpuMax = stat.quota;
      this.cpuData.yData.push(stat.used);
      this.cpuData.xData.push(this.cpuTime++);
    }));

    this.subscriptions.push(this.memStat.subscribe(stat => {
      this.memVal = stat.used;
      this.memMax = stat.quota;
      this.memData.yData.push(stat.used);
      this.memData.xData.push(this.cpuTime++);
      this.memUnits = stat.units;
    }));
  }

  delete(): void {
    this.subscriptions.push(
      this.deploymentsService.deleteApplication(this.spaceId, this.applicationId, this.environment.name)
        .subscribe(
          success => {
            this.notifications.message({
              type: NotificationType.SUCCESS,
              message: success
            });
          },
          error => {
            this.notifications.message({
              type: NotificationType.INFO,
              message: error
            });
          }
        )
    );
  }
}
