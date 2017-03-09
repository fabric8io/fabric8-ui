import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { AuthenticationService, User, UserService } from 'ng-login';

// import { ProfileService } from './../profile/profile.service';
import { LocalStorageService } from 'angular-2-local-storage';
import { Notification, Notifications, NotificationType } from 'ngx-fabric8-wit';
import { Broadcaster } from 'ngx-login-client';


@Component({
  selector: 'alm-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.scss']
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
