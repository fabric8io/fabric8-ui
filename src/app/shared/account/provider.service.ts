import { Inject, Injectable } from '@angular/core';

import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';

import * as jwt_decode from 'jwt-decode';
import { Logger } from 'ngx-base';
import { AUTH_API_URL, AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { Link } from './link';

@Injectable()
export class ProviderService {
  private loginUrl: string;
  private linkUrl: string;
  private headers: HttpHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });


  constructor(
      private http: HttpClient,
      private auth: AuthenticationService,
      private logger: Logger,
      @Inject(AUTH_API_URL) private apiUrl: string) {
    this.loginUrl = apiUrl + 'link';
    this.linkUrl = apiUrl + 'token/link';
    if (this.auth.getToken() != null) {
      this.headers = this.headers.set('Authorization', `Bearer ${this.auth.getToken()}`);
    }
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param cluster URL of the openshift cluster the user is associated with
   * @param redirect URL to be redirected to after successful account linking
   */
  linkAll(cluster: string, redirect: string): void {
    let redirectToGithubLinkURL = window.location.origin + '/_gettingstarted?wait=true&link=' + encodeURIComponent('https://github.com');
    // after linking github, proceed with linking openshift-v3,
    // hence passing openshift linking url as a redirect.
    this.linkOpenShift(cluster, redirectToGithubLinkURL);
  }

  /**
   * Link a GitHub account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkGitHub(next: string): void {
    this.link('https://github.com', next);
  }


  disconnectGitHub(): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?for=https://github.com';
    return this.http
      .delete(tokenUrl, { headers: this.headers })
      .map(() => {
        this.auth.clearGitHubToken();
      });

  }

  getGitHubStatus(): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?force_pull=true&for=https://github.com';
    return this.http.get(tokenUrl, { headers: this.headers });
  }

  getOpenShiftStatus(cluster: string): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?force_pull=true&for=' + cluster;
    return this.http.get(tokenUrl, { headers: this.headers });
  }

  disconnectOpenShift(cluster: string): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?for=' + cluster;
    return this.http.delete(tokenUrl, { headers: this.headers });
  }

  getLegacyLinkingUrl(provider: string, redirect: string): string {
    let parsedToken = jwt_decode(this.auth.getToken());
    let url = this.loginUrl + '/session?'
    + 'clientSession=' + parsedToken.client_session
    + '&sessionState=' + parsedToken.session_state
    + '&redirect=' + redirect ; // brings us back to Getting Started.
    if (provider != undefined) {
      url += '&provider=' + provider;
    }
    return url;
  }

  getLinkingURL(provider: string, redirect: string): string {
    let linkURL = this.linkUrl + '?for=' + provider + '&redirect=' +  encodeURIComponent(redirect) ;
    return linkURL;
  }


  /**
   * Link an OpenShift.com account to the user account
   *
   * @param cluster URL of the openshift cluster the user is associated with
   * @param redirect URL to be redirected to after successful account linking
   */
  linkOpenShift(cluster: string, redirect: string): void {
    this.link(cluster, redirect);
  }


  /**
   * Link an Identity Provider account to the user account
   *
   * @param provider Identity Provider name to link to the user's account
   * @param redirect URL to be redirected to after successful account linking
   */
  link(provider: string, redirect: string): void {
    let linkURL = this.linkUrl + '?for=' + provider + '&redirect=' +  encodeURIComponent(redirect) ;
    this.http.get(linkURL, { headers: this.headers })
      .map((resp: Link) => {
        this.redirectToAuth(resp.redirect_location);
      })
      .catch((err: HttpErrorResponse) => {
        return this.handleError(err);
      }).subscribe();
  }

  // Private

  private redirectToAuth(url) {
    window.location.href = url;
  }

  private handleError(error: HttpErrorResponse) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
