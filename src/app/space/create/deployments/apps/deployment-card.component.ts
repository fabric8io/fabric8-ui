import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { NotificationType } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';

import { NotificationsService } from 'app/shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

const STAT_THRESHOLD = .6;

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html',
  styleUrls: ['./deployment-card.component.less']
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  active: boolean = false;
  collapsed: boolean = true;
  version: Observable<string>;
  logsUrl: Observable<string>;
  consoleUrl: Observable<string>;
  appUrl: Observable<string>;

  cpuStat: Observable<CpuStat>;
  iconClass: string;
  toolTip: string;

  subscriptions: Array<Subscription> = [];

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    this.toolTip = 'Everything is ok';

    this.cpuStat = this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.applicationId, this.environment.name);
    this.subscriptions.push(this.cpuStat.subscribe((stat) => {
      this.changeStatus(stat);
    }));

    this.subscriptions.push(
      this.deploymentsService
        .isApplicationDeployedInEnvironment(this.spaceId, this.applicationId, this.environment.name)
        .subscribe((active: boolean) => {
          this.active = active;

          if (active) {
            this.version =
              this.deploymentsService.getVersion(this.applicationId, this.environment.name);

            this.logsUrl =
              this.deploymentsService.getLogsUrl(this.spaceId, this.applicationId, this.environment.name);

            this.consoleUrl =
              this.deploymentsService.getConsoleUrl(this.spaceId, this.applicationId, this.environment.name);

            this.appUrl =
              this.deploymentsService.getAppUrl(this.spaceId, this.applicationId, this.environment.name);
          }
        })
    );
  }

  changeStatus(stat: CpuStat) {
    this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    this.toolTip = 'Everything is ok.';
    if (stat.used / stat.quota > STAT_THRESHOLD) {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_WARN;
      this.toolTip = 'CPU usage is nearing capacity.';
    }

    if (stat.used > stat.quota) {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_ERR;
      this.toolTip = 'CPU usage has exceeded capacity.';
    }
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
              type: NotificationType.WARNING,
              message: error
            });
          }
        )
    );
  }
}
