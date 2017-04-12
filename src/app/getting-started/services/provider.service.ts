import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';

@Injectable()
export class ProviderService {
  private loginUrl: string;

  constructor(
      private auth: AuthenticationService,
      private logger: Logger,
      @Inject(WIT_API_URL) apiUrl: string) {
    this.loginUrl = apiUrl + 'login';
  }

  /**
   * Link an OpenShit.com account to the user account
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
  linkGitHub(redirect: string): void {
    this.link("github", redirect);
  }

  /**
   * Link an OpenShit.com account to the user account
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
    let parsedToken = this.parseJwt(this.auth.getToken());
    let url = `${this.loginUrl}/linksession?`
      + "clientSession=" + parsedToken.client_session
      + "&sessionState=" + parsedToken.session_state
      + "&redirect=" + redirect;
    if (provider != null) {
      url += "&provider=" + provider;
    }
    this.redirectToAuth(url);
  }

  // Private

  /**
   * Helper to parse JWT token
   *
   * @param token
   * @returns {any} The parsed JWT token
   */
  private parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  };

  private redirectToAuth(url) {
    window.location.href = url;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
