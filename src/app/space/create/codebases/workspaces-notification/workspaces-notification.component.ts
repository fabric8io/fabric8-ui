import {
  Component,
  DoCheck,
  Input,
  OnInit
} from '@angular/core';

import { NotificationType } from 'patternfly-ng/notification';

@Component({
  selector: 'f8-workspaces-notification',
  styleUrls: ['./workspaces-notification.component.less'],
  templateUrl: './workspaces-notification.component.html'
})
export class WorkspacesNotificationComponent implements DoCheck, OnInit {
  /**
   * Indicates notification is shown
   */
  @Input() dismiss: boolean = false;

  /**
   * Delay (in ms) indicating for how long to display notification after show is set to false
   */
  @Input() dismissDelay: number = 7000;

  /**
   * Notification message
   */
  @Input() message: string = '';

  /**
   * The notification type (e.g., NotificationType.SUCCESS, NotificationType.INFO, etc.)
   */
  @Input() type: string = NotificationType.INFO;

  private _hide: boolean = false;

  constructor() {
  }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.dismiss === true) {
      setTimeout(() => {
        this._hide = this.dismiss;
      }, this.dismissDelay);
    }
  }

  /**
   * Indicates notification should be hidden
   */
  get hide(): boolean {
    return this._hide;
  }
}
