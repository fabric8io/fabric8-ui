import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { Headers, Http} from '@angular/http';
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
      @Inject(AUTH_API_URL) apiUrl: string) {
    this.loginUrl = apiUrl + 'link';
    this.linkUrl = apiUrl + 'token/link';
  }

  /**
   * Link an OpenShift.com account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkAll(redirect: string): void {
    this.link(null, redirect);
  }

  /**
   * Link a GitHub account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkGitHub(redirect: string): void{
    let headers = new Headers();
    let githubLinkURL = this.linkUrl + `redirect=` + redirect ;

    this.http
    .get(this.linkUrl, { headers: headers })
    .map(response => {
      let redirectInfo = response.json() as Link;
      this.redirectToAuth(redirectInfo.redirect);
    })
    .catch((error) => {
      return this.handleError(error);
    });
  }

   /**
   * Link a GitHub and OpenShift Online account to the user account
   *
   * @param redirect URL to be redirected to after successful account linking
   */
  linkGitHubAndOpenShift(redirect: string): void {

    let parsedToken = jwt_decode(this.auth.getToken());
    // the new url is /api/link/session 
    let opensShiftLinkingRedirectUrl = this.getLegacyLinkingUrl("openshift-v3",redirect);
    this.linkGitHub(opensShiftLinkingRedirectUrl);
  }

  getLegacyLinkingUrl(provider: string, redirect: string): string{
    let parsedToken = jwt_decode(this.auth.getToken());    
    let url = this.loginUrl + `/session?`
    + "clientSession=" + parsedToken.client_session
    + "&sessionState=" + parsedToken.session_state
    + "&redirect=" + redirect // brings us back to Getting Started.
    + "&provider="+provider;
    return url
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
    let parsedToken = jwt_decode(this.auth.getToken());
    // the new url is /api/link/session 
    let url = `${this.loginUrl}/session?`
      + "clientSession=" + parsedToken.client_session
      + "&sessionState=" + parsedToken.session_state
      + "&redirect=" + redirect;
    if (provider != null) {
      url += "&provider=" + provider;
    }
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
