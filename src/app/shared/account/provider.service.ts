import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Headers, Http, RequestOptions} from '@angular/http';
import { AuthenticationService,AUTH_API_URL } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import * as jwt_decode from 'jwt-decode';
import { Link } from './link';

@Injectable()
export class ProviderService {
  private loginUrl: string;
  private linkUrl: string;

  constructor(
      private http: Http,
      private auth: AuthenticationService,
      private logger: Logger,
      @Inject(AUTH_API_URL) private apiUrl: string) {
    this.loginUrl = apiUrl + 'link';
    this.linkUrl = apiUrl + 'token/link';
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkAll(redirect: string): void {
        let openShiftLinkingRedirectUrl = this.getLegacyLinkingUrl("openshift-v3",redirect);
        // after linking github, proceed with linking openshift-v3,
        // hence passing openshift linking url as a redirect.
        this.linkGitHub(openShiftLinkingRedirectUrl);
  }

  /**
   * Link a GitHub account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkGitHub(next: string): void{
    // let tokenUrl = this.apiUrl + 'token/link?for=https://github.com&redirect=' + encodeURIComponent(redirectUrl);
    let githubLinkURL = this.linkUrl + "?for=https://github.com&redirect=" +  encodeURIComponent(next) ;
    console.log("attempting to connect github "+ githubLinkURL);
    this.http
    .get(githubLinkURL)
    .map(response => {
      // TODO: what happens to this when the response is not a pure json
      let redirectInfo = response.json() as Link;
      this.redirectToAuth(redirectInfo.redirect_location);

      // todo - handle redirect info?
      console.log(redirectInfo);
    })
    .catch((error) => {
      console.log("error while linking github "+ githubLinkURL);
      return this.handleError(error);
    }).subscribe();
  }

  disconnectGitHub(): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?for=https://github.com';
    return this.http
      .delete(tokenUrl)
      .map((response) => {
        this.auth.clearGitHubToken();
        console.log(response);
      });

  }

  getGitHubStatus(): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?force_pull=true&for=https://github.com';
    return this.http.get(tokenUrl)
      .map((response) => {
        return response.json();
      });
  }

  disconnectOpenShift(cluster: string): Observable<any> {
    let tokenUrl = this.apiUrl + 'token?for=' + cluster;
    return this.http
      .delete(tokenUrl)
      .map((response) => {
        console.log(response);
      });
  }

  getLegacyLinkingUrl(provider: string, redirect: string): string{
    let parsedToken = jwt_decode(this.auth.getToken());
    let url = this.loginUrl + "/session?"
    + "clientSession=" + parsedToken.client_session
    + "&sessionState=" + parsedToken.session_state
    + "&redirect=" + redirect ;// brings us back to Getting Started.
    if (provider != null) {
      url += "&provider=" + provider;
    }
    return url;
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkOpenShift(redirect: string): void {
    this.link("openshift-v3", redirect);
  }

  /**
   * Link an Identity Provider account to the user account
   *
   * @param provider Identity Provider name to link to the user's account
   * @param redirect URL to be redirected to after successful account linking
   */
  link(provider: string, redirect: string): void {
    let url = this.getLegacyLinkingUrl(provider,redirect);
    this.redirectToAuth(url);
  }

  // Private

  private redirectToAuth(url) {
    window.location.href = url;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
