import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { debounce } from 'lodash';
import { NotificationType } from 'ngx-base';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';

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

  @Input() spaceId: Observable<string>;
  @Input() applicationId: string;
  @Input() environment: Environment;

  active: boolean = false;
  detailsActive: boolean = false;
  collapsed: boolean = true;

  version: Subject<string> = new ReplaySubject(1);
  logsUrl: Subject<string> = new ReplaySubject(1);
  consoleUrl: Subject<string> = new ReplaySubject(1);
  appUrl: Subject<string> = new ReplaySubject(1);

  cpuStat: Subject<CpuStat> = new ReplaySubject(1);

  iconClass: string;
  toolTip: string;

  subscriptions: Array<Subscription> = [];

  private readonly waitTime: number = 5000; // 5 seconds
  private readonly maxWaitTime: number = 10000; // 10 seconds
  private debouncedUpdateDetails = debounce(this.updateDetails, this.waitTime, { maxWait: this.maxWaitTime});
  private spaceIdReference: string;

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

    this.subscriptions.push(this.spaceId.subscribe((spaceId: string) => {
      this.spaceIdReference = spaceId;
      this.subscriptions.push(
        this.deploymentsService
          .getDeploymentCpuStat(spaceId, this.applicationId, this.environment.name)
          .subscribe(this.cpuStat)
      );
      this.subscriptions.push(this.cpuStat.subscribe((stat) => {
        this.changeStatus(stat);
      }));

      this.subscriptions.push(
        this.deploymentsService
          .isApplicationDeployedInEnvironment(spaceId, this.applicationId, this.environment.name)
          .subscribe((active: boolean) => {
            this.active = active;

            if (active) {
              this.subscriptions.push(
                this.deploymentsService
                  .getVersion(spaceId, this.applicationId, this.environment.name)
                  .subscribe(this.version)
              );

              this.subscriptions.push(
                this.deploymentsService
                  .getLogsUrl(spaceId, this.applicationId, this.environment.name)
                  .subscribe(this.logsUrl)
              );
              this.subscriptions.push(
                this.deploymentsService
                  .getConsoleUrl(spaceId, this.applicationId, this.environment.name)
                  .subscribe(this.consoleUrl)
              );

              this.subscriptions.push(
                this.deploymentsService
                  .getAppUrl(spaceId, this.applicationId, this.environment.name)
                  .subscribe(this.appUrl)
              );
            }
          })
      );
    }));
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

  toggleCollapsed(): void {
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
    if (this.spaceIdReference) {
      this.subscriptions.push(
        this.deploymentsService.deleteApplication(this.spaceIdReference, this.applicationId, this.environment.name)
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
    } else {
      this.notifications.message({
        type: NotificationType.WARNING,
        message: 'Unable to delete. Unknown space.'
      });
    }
  }
}
