import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';

import { debounce } from 'lodash';
import { NotificationType } from 'ngx-base';
import { Observable, Subscription } from 'rxjs';

import { NotificationsService } from '../../../../shared/notifications.service';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';
import { DeleteDeploymentModal } from './delete-deployment-modal.component';
import { DeploymentStatusIconComponent } from './deployment-status-icon.component';

enum CardStatusClass {
  OK = '',
  WARN = 'status-ribbon-warn',
  ERR = 'status-ribbon-err'
}

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html',
  styleUrls: ['./deployment-card.component.less']
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  public static readonly OK_TOOLTIP: string = 'Everything is ok';
  private static readonly DEBOUNCE_TIME: number = 5000; // 5 seconds
  private static readonly MAX_DEBOUNCE_TIME: number = 10000; // 10 seconds

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: string;
  @Output() collapsedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ViewChild(DeleteDeploymentModal) deleteDeploymentModal: DeleteDeploymentModal;

  active: boolean = false;
  detailsActive: boolean = false;
  deleting: boolean = false;
  version: Observable<string>;
  logsUrl: Observable<string>;
  consoleUrl: Observable<string>;
  appUrl: Observable<string>;

  cardStatusClass: string;

  iconClass: string;
  toolTip: string;

  private _collapsed: boolean;

  private readonly subscriptions: Array<Subscription> = [];

  private readonly debouncedUpdateDetails = debounce(this.updateDetails, DeploymentCardComponent.DEBOUNCE_TIME, { maxWait: DeploymentCardComponent.MAX_DEBOUNCE_TIME });

  constructor(
    private deploymentsService: DeploymentsService,
    private statusService: DeploymentStatusService,
    private notifications: NotificationsService
  ) { }

  @Input() set collapsed(collapsed: boolean) {
    this._collapsed = collapsed;
    if (!this._collapsed) {
      this.detailsActive = true;
    }
    this.collapsedChange.emit(this.collapsed);
  }

  get collapsed() {
    return this._collapsed;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnInit(): void {
    this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    this.toolTip = DeploymentCardComponent.OK_TOOLTIP;

    this.subscriptions.push(
      this.statusService.getDeploymentAggregateStatus(this.spaceId, this.environment, this.applicationId)
        .subscribe((status: Status): void => this.changeStatus(status))
    );

    this.subscriptions.push(
      this.deploymentsService
        .isApplicationDeployedInEnvironment(this.spaceId, this.environment, this.applicationId)
        .subscribe((active: boolean) => {
          this.active = active;

          if (active) {
            this.deleting = false;

            this.version =
              this.deploymentsService.getVersion(this.spaceId, this.environment, this.applicationId);

            this.logsUrl =
              this.deploymentsService.getLogsUrl(this.spaceId, this.environment, this.applicationId);

            this.consoleUrl =
              this.deploymentsService.getConsoleUrl(this.spaceId, this.environment, this.applicationId);

            this.appUrl =
              this.deploymentsService.getAppUrl(this.spaceId, this.environment, this.applicationId);
          }
        })
    );
  }

  changeStatus(status: Status): void {
    let toolTip: string = status.message;
    if (!toolTip) {
      toolTip = DeploymentCardComponent.OK_TOOLTIP;
    }
    this.toolTip = toolTip;

    if (status.type === StatusType.ERR) {
      this.cardStatusClass = CardStatusClass.ERR;
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_ERR;
    } else if (status.type === StatusType.WARN) {
      this.cardStatusClass = CardStatusClass.WARN;
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_WARN;
    } else {
      this.cardStatusClass = CardStatusClass.OK;
      this.iconClass = DeploymentStatusIconComponent.CLASSES.ICON_OK;
    }
  }

  toggleCollapsed(event: Event): void {
    if (!this.deleting) {
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
  }

  updateDetails(): void {
    if (this.collapsed) {
      this.detailsActive = false;
    }
  }

  openModal(): void {
    this.deleteDeploymentModal.openModal();
  }

  delete(): void {
    this.subscriptions.push(
      this.deploymentsService.deleteDeployment(
        this.spaceId,
        this.environment,
        this.applicationId
        )
        .first()
        .finally(() => this.deleting = false)
        .subscribe(
          (success: string) => {
            this.notifications.message({
              type: NotificationType.SUCCESS,
              message: success
            });
            this.active = false;
          },
          (error: any) => {
            this.notifications.message({
              type: NotificationType.WARNING,
              message: error
            });
          }
        )
    );
    this.lockAndDelete();
  }

  private lockAndDelete(): void {
    this._collapsed = true;
    this.deleting = true;
  }
}
