import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { LoginService } from '../shared/login.service';

@Component({
  host: {
    class: 'app-component flex-container in-column-direction flex-grow-1',
  },
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.less'],
})
export class LandingPageComponent implements OnInit {
  isLoggedIn: boolean = false;

  constructor(
    private broadcaster: Broadcaster,
    private loginService: LoginService,
    private authService: AuthenticationService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isLoggedIn();
    if (this.isLoggedIn) {
      this.loginService.redirectAfterLogin();
    }
  }

  login() {
    this.broadcaster.broadcast('login');
    this.loginService.redirectToAuth();
  }
}
