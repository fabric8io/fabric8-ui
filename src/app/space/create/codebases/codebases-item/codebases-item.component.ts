import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Rx';

import { Che } from '../services/che';
import { Codebase } from '../services/codebase';
import { CodebasesService } from '../services/codebases.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'codebases-item',
  templateUrl: './codebases-item.component.html'
})
export class CodebasesItemComponent implements OnDestroy, OnInit {
  @Input() cheState: Che;
  @Input() codebase: Codebase;
  @Input() index: number = -1;

  subscriptions: Subscription[] = [];

  constructor(
    private notifications: Notifications,
    private codebasesService: CodebasesService) {
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {
  }

  onChangeSubscribe(event: {previousValue: boolean, currentValue: boolean}, codebase): void {
    codebase.attributes['cve-scan'] = event.currentValue;
    this.updateCodebase(codebase);
  }

  /**
   * update Codebase codebase with current CVE scan
   * @param codebase
   */
  updateCodebase(codebase): void {
    this.subscriptions.push(this.codebasesService.updateCodebases(codebase).subscribe(() => {
      let statusMsg: string = '';
      if (codebase.attributes['cve-scan']) {
        statusMsg = `The codebase has been successfully subscribed for receiving security alerts.`;
      } else {
        statusMsg = `The codebase has been successfully unsubscribed from receiving security alerts.`;
      }
      this.ShowSubscriptionStatus(statusMsg , NotificationType.SUCCESS);
    }, (error: any) => {
      codebase.attributes['cve-scan'] = !codebase.attributes['cve-scan'];
      this.ShowSubscriptionStatus(`Status: ${error.status}, Unable to update security alert subscription for codebase ${codebase.name} .` , NotificationType.DANGER);
    }));
  }

  /**
   * Show subscription status for codebase security alerts
   *
   * @param msg
   * @param type
   */
  private ShowSubscriptionStatus(msg: string, type: NotificationType) {
    this.notifications.message({
      message: msg,
      type: type
    } as Notification);
  }
}
