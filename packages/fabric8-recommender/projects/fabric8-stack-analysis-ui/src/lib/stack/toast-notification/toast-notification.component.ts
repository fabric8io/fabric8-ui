import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fab-toast-notification',
  styleUrls: ['./toast-notification.component.less'],
  templateUrl: './toast-notification.component.html'
})
export class ToastNotificationComponent {

  @Input() notifications: any;

  closeToastNotification(notification: any) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

 }
