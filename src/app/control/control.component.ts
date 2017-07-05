import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';


@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.less']
})
export class ControlComponent implements OnInit {

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private broadcaster: Broadcaster,
    private notifications: Notifications
  ) { }

  ngOnInit() {

  }

  clearLocalStorage() {
    this.localStorageService.clearAll();
    this.notifications.message({ message: 'Local storage successfully cleared', type: NotificationType.SUCCESS} as Notification);
  }

}
