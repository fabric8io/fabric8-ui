import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';

import { AuthenticationService, Broadcaster, User, UserService } from 'ngx-login-client';
import { Notification, NotificationType, Notifications } from 'ngx-fabric8-wit';

import { LoginService } from '../shared/login.service';
import { ProfileService } from './../profile/profile.service';



@Component({
  selector: 'alm-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  constructor(
    public auth: AuthenticationService,
    private loginService: LoginService,
    private profile: ProfileService,
    private broadcaster: Broadcaster,
    private notifications: Notifications,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    let error = this.getUrlParameter('error');
    if (error) {
      this.notifications.message({ message: error, type: NotificationType.DANGER } as Notification);
    } else {
      this.userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.profile.initDefaults(val);
          if (this.profile.sufficient) {
            this.loginService.redirectAfterLogin();
          } else {
            this.notifications.message({
              message: 'You must <a href="https://developers.redhat.com/auth/realms/rhd/account/">' +
              'complete your profile</a>. Ensure you have provided your full name and email address.',
              type: NotificationType.DANGER
            } as Notification);
          }
        }
      });
    }
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

  private getUrlParameter(name): string {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    let results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };

}
