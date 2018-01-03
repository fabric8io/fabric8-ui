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

  subscriptions: Array<Subscription> = [];

  constructor(
    private deploymentsService: DeploymentsService,
    private notifications: NotificationsService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  ngOnInit(): void {
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
