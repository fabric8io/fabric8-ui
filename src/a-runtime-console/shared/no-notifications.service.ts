import { Injectable } from '@angular/core';
import { Notification, NotificationAction, Notifications } from 'ngx-base';
import { Observable } from 'rxjs';

@Injectable()
export class NoNotifications implements Notifications {

  recent: Observable<Notification[]> = Observable.empty();
  message(notification: Notification): Observable<NotificationAction> {
    return Observable.empty();
  }

}
