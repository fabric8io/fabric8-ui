import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'angular-2-local-storage';
import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService, UserService } from 'ngx-login-client';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { WindowService } from './window.service';

@Injectable()
export class LoginService {
  static readonly REDIRECT_URL_KEY = 'redirectUrl';
  static readonly DEFAULT_URL = '/_home';
  // URLs that the redirect should ignore
  static readonly BANNED_REDIRECT_URLS = ['/'];
  static readonly LOGIN_URL = '/';

  private window: Window;
  private authUrl: string; // URL to web api

  public openShiftToken: string;

  constructor(
    windowService: WindowService,
    private router: Router,
    private localStorage: LocalStorageService,
    @Inject(AUTH_API_URL) private apiUrl: string,
    private broadcaster: Broadcaster,
    private authService: AuthenticationService,
    private notifications: Notifications,
    private userService: UserService,
  ) {
    this.window = windowService.getNativeWindow();
    // Removed ?link=true in favor of getting started page
    this.authUrl = apiUrl + 'login';
    this.broadcaster.on('authenticationError').subscribe(() => {
      this.authService.logout();
    });
    this.broadcaster.on('noFederatedToken').subscribe(() => {
      // Don't log out first time users from getting started as tokens may not exist
      if (
        this.router.url !== '/' &&
        this.router.url.indexOf('_gettingstarted') === -1 &&
        this.router.url.indexOf('_update') === -1
      ) {
        this.authService.logout();
      }
    });
  }

  redirectToAuth() {
    var authUrl = this.authUrl;
    if (authUrl.indexOf('?') < 0) {
      // lets ensure there's a redirect parameter to avoid WIT barfing
      authUrl += '?redirect=' + this.window.location.href;
    }
    this.window.location.href = authUrl;
  }

  public redirectAfterLogin() {
    let url = this._redirectUrl;
    if (!url || LoginService.BANNED_REDIRECT_URLS.indexOf(url) >= 0) {
      url = LoginService.DEFAULT_URL;
    }
    this.router.navigateByUrl(url);
  }

  public redirectToLogin(currentUrl: string) {
    this.redirectUrl = currentUrl;
    this.window.location.href = LoginService.LOGIN_URL;
  }

  public logout() {
    this.authService.logout();
    this.window.location.href =
      this.apiUrl + 'logout?redirect=' + encodeURIComponent(this.window.location.origin);
  }

  public login() {
    let query = this.window.location.search.substr(1);
    let result: any = {};
    query.split('&').forEach(function(part) {
      let item: any = part.split('=');
      result[item[0]] = decodeURIComponent(item[1]);
    });

    if (result['error']) {
      this.notifications.message({
        message: result['error'],
        type: NotificationType.DANGER,
      } as Notification);
    }

    if (result['token_json']) {
      // Handle the case that this is a login
      this.authService.logIn(result['token_json']);
      this.authService
        .getOpenShiftToken()
        .pipe(
          catchError((err) => {
            console.log('Unable to get OpenShift token', err);
            return of(null);
          }),
        )
        .subscribe((token) => (this.openShiftToken = token));
      // Navigate back to the current URL to clear up the query string
      this.router.navigateByUrl(this.router.url);
    } else if (this.authService.isLoggedIn()) {
      // Handle the case the user is already logged in
      this.authService.onLogIn();
      this.authService
        .getOpenShiftToken()
        .pipe(
          catchError((err) => {
            console.log('Unable to get OpenShift token', err);
            return of(null);
          }),
        )
        .subscribe((token) => (this.openShiftToken = token));
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
