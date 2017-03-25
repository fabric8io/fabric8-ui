import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Broadcaster, Notifications, Notification, NotificationType } from 'ngx-base';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import { ContextService } from './context.service';
import { Navigation } from './../models/navigation';


@Injectable()
export class LoginService {

  static readonly REDIRECT_URL_KEY = 'redirectUrl';
  static readonly DEFAULT_URL = '/_home';
  // URLs that the redirect should ignore
  static readonly BANNED_REDIRECT_URLS = ['/'];
  static readonly LOGIN_URL = '/';


  private authUrl: string;  // URL to web api

  public openShiftToken: string;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(WIT_API_URL) apiUrl: string,
    private broadcaster: Broadcaster,
    private authService: AuthenticationService,
    private contextService: ContextService,
    private notifications: Notifications,
    private userService: UserService
  ) {
    this.authUrl = apiUrl + 'login/authorize';
    this.broadcaster.on('authenticationError').subscribe(() => {
      this.authService.logout();
    });
  }

  redirectToAuth() {
    window.location.href = this.authUrl;
  }

  public redirectAfterLogin() {
    let url = this._redirectUrl;
    if (!url || LoginService.BANNED_REDIRECT_URLS.indexOf(url) >= 0) {
      url = LoginService.DEFAULT_URL;
    }
    this.router.navigateByUrl(url);
  }

  public redirectToLogin(currentUrl: string) {
    console.log('Please login to access ' + currentUrl);
    this.redirectUrl = currentUrl;
    window.location.href = LoginService.LOGIN_URL;
  }

  public logout() {
    this.authService.logout();
  }

  public login() {
    let query = window.location.search.substr(1);
    let result: any = {};
    query.split('&').forEach(function (part) {
      let item: any = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    if (result['error']) {
      this.notifications.message({ message: result['error'], type: NotificationType.DANGER } as Notification);
    } else if (result['token_json']) {
      // Handle the case that this is a login
      this.authService.logIn(result['token_json']);
      this.authService.getOpenShiftToken().subscribe(token => this.openShiftToken);
    } else if (this.authService.isLoggedIn()) {
      // Handle the case the user is already logged in
      this.authService.onLogIn();
      this.authService.getOpenShiftToken().subscribe(token => this.openShiftToken);
    }
  }

  public set redirectUrl(value: string) {
    if (value) {
      this.localStorage.set(LoginService.REDIRECT_URL_KEY, value);
    }
  }

  private get _redirectUrl(): string {
    let res = this.localStorage.get<string>(LoginService.REDIRECT_URL_KEY);
    this.localStorage.remove(LoginService.REDIRECT_URL_KEY);
    return res;
  }

}
