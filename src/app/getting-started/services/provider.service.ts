import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthenticationService } from 'ngx-login-client';
import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';

import * as jwt_decode from 'jwt-decode';
import {ApiLocatorService} from "../../shared/api-locator.service";
import {pathJoin} from "fabric8-runtime-console/src/app/kubernetes/model/utils";

@Injectable()
export class ProviderService {

  constructor(
      private auth: AuthenticationService,
      private apiLocator: ApiLocatorService,
      private logger: Logger) {
  }

  protected get apiUrl(): string {
    return this.apiLocator.witApiUrl;
  }

  protected get loginUrl(): string {
    return pathJoin(this.apiUrl, 'login');
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
  linkGitHub(redirect: string): void {
    this.link("github", redirect);
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

  private redirectToAuth(url) {
    window.location.href = url;
  }

  private handleError(error: any) {
    this.logger.error(error);
    return Observable.throw(error.message || error);
  }
}
