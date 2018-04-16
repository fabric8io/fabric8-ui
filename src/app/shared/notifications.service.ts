import { Injectable } from '@angular/core';

import { Notification, NotificationAction, Notifications } from 'ngx-base';
import { NotificationService } from 'patternfly-ng/notification';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationsService implements Notifications {

  static readonly MAX_TOAST_NOTIFICATIONS = 8;

  actionSubject = new Subject<any>();
  private _actionObserver = this.actionSubject
    .asObservable()
    .map(val => val as NotificationAction);

  private _stream: Subject<Notification> = new Subject();

  constructor(private notificationService: NotificationService) {
  }

  message(notification: Notification): Observable<NotificationAction> {
    // Trim the list
    if (this.notificationService.getNotifications.length > NotificationsService.MAX_TOAST_NOTIFICATIONS) {
      for (let i: number = this.notificationService.getNotifications().length - 1; i >= 0; i--) {
        if (i >= 8) {
          this.notificationService.remove(this.notificationService.getNotifications()[i]);
        }
      }
    }

    this.notificationService.message(
      notification.type.cssClass,
      notification.header,
      notification.message,
      false,
      notification.primaryAction,
      notification.moreActions
    );
    this._stream.next(notification);
    return this._actionObserver;
  }

  get stream(): Observable<Notification> {
    return this._stream.asObservable();
  }

  get current(): any[] {
    return this.notificationService.getNotifications();
  }

  get recent(): Observable<Notification[]> {
    return Observable.empty();
  }

}
