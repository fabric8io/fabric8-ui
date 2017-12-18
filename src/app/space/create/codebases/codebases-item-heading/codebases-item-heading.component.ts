import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { Che } from '../services/che';
import { NotificationType } from 'patternfly-ng';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item-heading',
  templateUrl: './codebases-item-heading.component.html',
  styleUrls: ['./codebases-item-heading.component.less']
})
export class CodebasesItemHeadingComponent implements OnInit {
  @Input() cheState: Che;

  cheErrorMessage: string = 'Your Workspaces failed to load';
  cheRunningMessage: string = 'Your Workspaces have loaded successfully';
  cheStartingMessage: string = 'Your Workspaces are loading...';
  cheFinishedMultiTenantMigrationMessage: string = "Migration to the Multi-Tenant Che server has finished!";
  chePerformingMultiTenantMigrationMessage: string = "Migrating workspaces to the Multi-Tenant Che server...";

  constructor() {
  }

  ngOnInit(): void {
  }

  /**
   * Returns the notification message based on state of Che.
   *
   * @returns {string}
   */
  getNotificationMessage(): string {
    if (this.cheState !== undefined && this.cheState !== null) {
      if (this.cheState.multiTenant !== undefined && this.cheState.multiTenant === true) {
        return this.cheState.running
          ? this.cheFinishedMultiTenantMigrationMessage : this.chePerformingMultiTenantMigrationMessage;
      } else {
        return this.cheState.running ? this.cheRunningMessage : this.cheStartingMessage;
      }
    } else {
      return this.cheErrorMessage;
    }
  }

  /**
   * Returns the notification type based on the state of Che.
   *
   * @returns {string}
   */
  getNotificationType(): string {
    if (this.cheState !== undefined) {
      return this.cheState.running ? NotificationType.SUCCESS : NotificationType.INFO;
    } else {
      return NotificationType.DANGER;
    }
  }
}
