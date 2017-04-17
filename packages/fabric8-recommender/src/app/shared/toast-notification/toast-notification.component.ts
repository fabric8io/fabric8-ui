import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'fab-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss']
})
export class ToastNotificationComponent {

  @Input() notifications: any;

  closeToastNotification(notification: any) {
    this.notifications.splice(this.notifications.indexOf(notification), 1);
  }

 }
