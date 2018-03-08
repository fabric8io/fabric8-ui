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
import { DeploymentsService } from '../services/deployments.service';
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

const STAT_THRESHOLD = .6;

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

  cpuStat: Observable<CpuStat[]>;
  memoryStat: Observable<MemoryStat[]>;
  iconClass: string;
  toolTip: string;

  subscriptions: Array<Subscription> = [];

  private readonly debouncedUpdateDetails = debounce(this.updateDetails, DeploymentCardComponent.DEBOUNCE_TIME, { maxWait: DeploymentCardComponent.MAX_DEBOUNCE_TIME });

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    this.toolTip = 'Everything is ok';

    this.cpuStat = this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.applicationId, this.environment.name, 1);
    this.memoryStat = this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.applicationId, this.environment.name);

    this.subscriptions.push(
      Observable.combineLatest(this.cpuStat, this.memoryStat)
        .subscribe((arr: [CpuStat[], MemoryStat[]]) => {
          const cpuStats: CpuStat[] = arr[0];
          const memoryStats: MemoryStat[] = arr[1];
          this.changeStatus(last(cpuStats), last(memoryStats));
        })
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

  changeStatus(cpuStat: CpuStat, memoryStat: MemoryStat): void {
    let toolTip: string = '';
    let hasWarning: boolean = false;
    let hasError: boolean = false;

    if (cpuStat.used >= cpuStat.quota) {
      hasError = true;
      toolTip += 'CPU usage has reached capacity. ';
    } else if (cpuStat.used / cpuStat.quota > STAT_THRESHOLD) {
      hasWarning = true;
      toolTip += 'CPU usage is nearing capacity. ';
    }

    if (memoryStat.used >= memoryStat.quota) {
      hasError = true;
      toolTip += 'Memory usage has reached capacity. ';
    } else if (memoryStat.used / memoryStat.quota > STAT_THRESHOLD) {
      hasWarning = true;
      toolTip += 'Memory usage is nearing capacity. ';
    }

    if (!toolTip) {
      toolTip = 'Everything is OK.';
    }
    this.toolTip = toolTip.trim();

    if (hasError) {
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_ERR;
    } else if (hasWarning) {
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
