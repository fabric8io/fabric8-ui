import { LoginService } from './../shared/login.service';
import { Broadcaster } from 'ngx-base';
import { Router } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { Spaces, Context, Contexts } from 'ngx-fabric8-wit';
import { UserService, User, AuthenticationService } from 'ngx-login-client';

@Component({
  host: {
    'class': "app-component flex-container in-column-direction flex-grow-1"
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less']
})
export class LandingPageComponent implements OnInit {

  constructor(
    private broadcaster: Broadcaster,
    private loginService: LoginService,
    private authService: AuthenticationService
  ) {
  }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loginService.redirectAfterLogin();
    }
  }

  login() {
    this.loginService.redirectUrl = '/_gettingstarted';
    this.broadcaster.broadcast('login');
    this.loginService.redirectToAuth();
  }

}
