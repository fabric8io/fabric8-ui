import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  debounce,
  last
} from 'lodash';
import { NotificationType } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';

import { NotificationsService } from 'app/shared/notifications.service';
import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html',
  styleUrls: ['./deployment-card.component.less']
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  private static readonly DEBOUNCE_TIME: number = 5000; // 5 seconds
  private static readonly MAX_DEBOUNCE_TIME: number = 10000; // 10 seconds

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  active: boolean = false;
  detailsActive: boolean = false;
  collapsed: boolean = true;
  version: Observable<string>;
  logsUrl: Observable<string>;
  consoleUrl: Observable<string>;
  appUrl: Observable<string>;

  iconClass: string;
  toolTip: string;

  subscriptions: Array<Subscription> = [];

  private readonly debouncedUpdateDetails = debounce(this.updateDetails, DeploymentCardComponent.DEBOUNCE_TIME, { maxWait: DeploymentCardComponent.MAX_DEBOUNCE_TIME });

  constructor(
    private deploymentsService: DeploymentsService,
    private statusService: DeploymentStatusService,
    private notifications: NotificationsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    this.toolTip = 'Everything is ok';

    this.subscriptions.push(
      this.statusService.getAggregateStatus(this.spaceId, this.environment.name, this.applicationId)
        .subscribe((status: Status): void => this.changeStatus(status))
    );

    this.subscriptions.push(
      this.deploymentsService
        .isApplicationDeployedInEnvironment(this.spaceId, this.applicationId, this.environment.name)
        .subscribe((active: boolean) => {
          this.active = active;

          if (active) {
            this.version =
              this.deploymentsService.getVersion(this.spaceId, this.applicationId, this.environment.name);

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

  changeStatus(status: Status): void {
    let toolTip: string = status.message;
    if (!toolTip) {
      toolTip = 'Everything is OK.';
    }
    this.toolTip = toolTip;

    if (status.type === StatusType.ERR) {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_ERR;
    } else if (status.type === StatusType.WARN) {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_WARN;
    } else {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    }
  }

  toggleCollapsed(event: Event): void {
    if (event.defaultPrevented) {
      return;
    }
    this.collapsed = !this.collapsed;
    if (!this.collapsed) {
      this.detailsActive = true;
    } else {
      this.debouncedUpdateDetails();
    }
  }

  updateDetails(): void {
    if (this.collapsed) {
      this.detailsActive = false;
    }
  }

  delete(): void {
    this.subscriptions.push(
      this.deploymentsService.deleteApplication(this.spaceId, this.applicationId, this.environment.name)
        .subscribe(
          (success: string) => {
            this.notifications.message({
              type: NotificationType.SUCCESS,
              message: success
            });
          },
          (error: any) => {
            this.notifications.message({
              type: NotificationType.WARNING,
              message: error
            });
          }
        )
    );
  }
}
