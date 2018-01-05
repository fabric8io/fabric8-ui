import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Injectable, Inject } from '@angular/core';

import { Broadcaster } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { WIT_API_URL } from 'ngx-fabric8-wit';

@Injectable()
export class LoginService {

  static readonly REDIRECT_URL_KEY = 'redirectUrl';
  static readonly DEFAULT_URL = '/home';
  static readonly LOGIN_URL = '/';
  // URLs that the redirect should ignore
  static readonly BANNED_REDIRECT_URLS = [ '/', '/public'];

  // switch to allow swapping between fabric8 auth and openshift authentication
  public useCustomAuth = false;

  private authUrl: string;  // URL to web api

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(WIT_API_URL) apiUrl: string,
    private broadcaster: Broadcaster,
    private authService: AuthenticationService
  ) {
    this.authUrl = apiUrl + 'login/authorize';
    this.broadcaster.on('authenticationError').subscribe(() => {
      this.authService.logout();
      this.redirectToLogin(this.router.url);
    });
    this.broadcaster.on('logout').subscribe(() => {
      this.router.navigateByUrl(LoginService.LOGIN_URL);
    });
  }

  // not used - redirects page to authUrl for login
  public gitHubSignIn() {
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
    this.router.navigateByUrl(LoginService.LOGIN_URL);
  }

  public logout() {
    this.authService.logout();
  }

  public login() {
    let query = window.location.search.substr(1);
    let result: any = {};
    query.split('&').forEach(function(part) {
      let item: any = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });
    if (result['token_json']) {
      // Handle the case that this is a login
      this.authService.logIn(result['token_json']);
    } else if (this.authService.isLoggedIn()) {
      // Handle the case the user is already logged in
      this.authService.onLogIn();
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
