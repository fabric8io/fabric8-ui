import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { User, UserService } from 'ngx-login-client';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.less'],
})
export class NotificationsComponent implements OnInit {
  loggedInUserName: String;

  constructor(private readonly userService: UserService) {}

  ngOnInit(): void {
    const currentUser: User = this.userService.currentLoggedInUser;
    this.loggedInUserName = currentUser.id ? currentUser.attributes.username : '';
  }
}
