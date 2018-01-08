import {
  Component,
  HostBinding,
  Input,
  ViewEncapsulation
} from '@angular/core';
import { NotificationType } from 'patternfly-ng';

import { Che } from '../../codebases/services/che';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'workspaces-item-heading',
  templateUrl: 'workspaces-item-heading.component.html',
  styleUrls: [ './workspaces-item-heading.component.less' ]
})
export class WorkspacesItemHeadingComponent {
  @Input() cheState: Che;
  @HostBinding('class.workspaces-item-heading')

  cheErrorMessage: string = 'Your Workspaces failed to load';
  cheRunningMessage: string = 'Your Workspaces have loaded successfully';
  cheStartingMessage: string = 'Your Workspaces are loading...';

  /**
   * Returns the notification message based on state of Che.
   *
   * @returns {string}
   */
  getNotificationMessage(): string {
    if (!this.cheState) {
      return this.cheErrorMessage;
    }
    return this.cheState.running ? this.cheRunningMessage : this.cheStartingMessage;
  }

  /**
   * Returns the notification type based on the state of Che.
   *
   * @returns {string}
   */
  getNotificationType(): string {
    if (!this.cheState) {
      return NotificationType.DANGER;
    }
    return this.cheState.running ? NotificationType.SUCCESS : NotificationType.INFO;
  }
}
