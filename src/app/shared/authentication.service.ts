import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

import { Observable, Subject } from 'rxjs';
import { Broadcaster } from 'ngx-base';
import {Token} from "ngx-login-client/src/app/user/token";
import {REALM} from "ngx-login-client";
import {ApiLocatorService} from "./api-locator.service";


export interface ProcessTokenResponse {
  (response: Response): Token;
}

/**
 * This class is like the one from ngx-login-client but resolves the
 * URLs for apiUrl and ssoUrl dynamically so we can have runtime environment
 * variables for them.
 */
@Injectable()
export class AuthenticationService {

  public openShiftToken: Observable<string>;
  public gitHubToken: Observable<string>;
  private refreshInterval: number;
  private realm: string;
  private clearTimeoutId: any;
  private refreshTokens: Subject<Token> = new Subject();
  readonly openshift = 'openshift-v3';
  readonly github = 'github';

  constructor(
    private broadcaster: Broadcaster,
    private apiLocator: ApiLocatorService,
    @Inject(REALM) realm: string,
    private http: Http
  ) {
    this.realm = realm;
    this.openShiftToken = this.createFederatedToken(this.openshift, (response: Response) => response.json() as Token);
    this.gitHubToken = this.createFederatedToken(this.github, (response: Response) => this.queryAsToken(response.text()));
  }


  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get ssoUrl(): string {
    return this.apiLocator.ssoApiUrl;
  }

  logIn(tokenParameter: string): boolean {
    let tokenJson = decodeURIComponent(tokenParameter);
    let token = this.processTokenResponse(JSON.parse(tokenJson));
    this.setupRefreshTimer(token.expires_in);

    // make sure old tokens are cleared out when we login again
    localStorage.removeItem(this.openshift + '_token');
    localStorage.removeItem(this.github + '_token');

    // kick off initial token refresh
    this.refreshTokens.next(token);

    this.onLogIn();
    return true;
  }

  onLogIn() {
    this.broadcaster.broadcast('loggedin', 1);
  }

  logout() {
    this.clearSessionData();
    this.broadcaster.broadcast('logout', 1);
  }

  isLoggedIn(): boolean {
    let token = localStorage.getItem('auth_token');
    if (token) {
      if (!this.clearTimeoutId) {
        // kick off initial token refresh
        this.refreshTokens.next({ "access_token": token } as Token);
        this.setupRefreshTimer(15);
      }
      return true;
    }
    return false;
  }

  getToken() {
    if (this.isLoggedIn()) return localStorage.getItem('auth_token');
  }

  getOpenShiftToken(): Observable<string> {
    if (localStorage.getItem(this.openshift + '_token')) {
      return Observable.of(localStorage.getItem(this.openshift + '_token'));
    }
    return this.openShiftToken;
  }

  setupRefreshTimer(refreshInSeconds: number) {
    if (!this.clearTimeoutId) {
      // refresh should be required to be less than ten minutes measured in seconds
      let tenMinutes = 60 * 10;
      if (refreshInSeconds > tenMinutes) {
        refreshInSeconds = tenMinutes;
      }
      let refreshInMs = Math.round(refreshInSeconds * .9) * 1000;
      console.log('Refreshing token in: ' + refreshInMs + ' milliseconds.');
      this.refreshInterval = refreshInMs;
      if (process.env.ENV !== 'inmemory') {
        // setTimeout() uses a 32 bit int to store the delay. So the max value allowed is 2147483647
        // The bigger number will cause immediate refreshing
        // but since we refresh in 10 minutes or in refreshInSeconds whatever is sooner we are good
        this.clearTimeoutId = setTimeout(() => this.refreshToken(), refreshInMs);
      }
    }
  }

  refreshToken() {
    if (this.isLoggedIn()) {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let refreshTokenUrl = this.apiUrl + 'login/refresh';
      let refreshToken = localStorage.getItem('refresh_token');
      let body = JSON.stringify({ 'refresh_token': refreshToken });
      this.http.post(refreshTokenUrl, body, headers)
        .map((response: Response) => {
          let responseJson = response.json();
          let token = this.processTokenResponse(responseJson.token);
          this.clearTimeoutId = null;
          this.setupRefreshTimer(token.expires_in);
          return token;
        })
        .catch(response => {
          // Additionally catch a 400 from keycloak
          if (response.status === 400) {
            this.broadcaster.broadcast('authenticationError', response);
          }
          return Observable.of({} as Token);
        })
        .subscribe(token => {
          // Refresh any federated tokens that we have
          this.refreshTokens.next(token);
          console.log('token refreshed at:' + Date.now());
        });
    }
  }

  processTokenResponse(response: any): Token {
    let token = response as Token;
    localStorage.setItem('auth_token', token.access_token);
    localStorage.setItem('refresh_token', token.refresh_token);
    return token;
  }

  private createFederatedToken(broker: string, processToken: ProcessTokenResponse): Observable<string> {
    let res = this.refreshTokens.switchMap(token => {
      let headers = new Headers({ 'Content-Type': 'application/json' });
      let tokenUrl = this.ssoUrl + `auth/realms/${this.realm}/broker/${broker}/token`;
      headers.set('Authorization', `Bearer ${token.access_token}`);
      let options = new RequestOptions({ headers: headers });
      return this.http.get(tokenUrl, options)
        .map(response => processToken(response))
        .catch(response => {
          if (response.status === 400) {
            this.broadcaster.broadcast('noFederatedToken', res);
          }
          return Observable.of({} as Token);
        })
        .do(token => localStorage.setItem(broker + '_token', token.access_token))
        .map(t => t.access_token);
    })
      .publishReplay(1);
    res.connect();
    return res;
  }

  private queryAsToken(query: string): Token {
    let vars = query.split('&');
    let token = {} as any;
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split('=');
      let key = decodeURIComponent(pair[0]);
      let val = decodeURIComponent(pair[1]);
      token[key] = val;
    }
    return token as Token;
  }

  private clearSessionData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem(this.openshift + '_token');
    localStorage.removeItem(this.github + '_token');
    clearTimeout(this.clearTimeoutId);
    this.refreshInterval = null;
  }
}