import { Observable } from 'rxjs';
import { Notifications, NotificationAction, Notification } from 'ngx-base';
import { Injectable } from '@angular/core';

@Injectable()
export class NoNotifications implements Notifications {

  recent: Observable<Notification[]> = Observable.empty();
  message(notification: Notification): Observable<NotificationAction> {
    return Observable.empty();
  }

}
