import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService, UserService, User,AUTH_API_URL } from 'ngx-login-client';

import { ExtUser, GettingStartedService } from './services/getting-started.service';
import { ProviderService } from './services/provider.service';
import {Fabric8UIConfig} from "../shared/config/fabric8-ui-config";
import {Observable} from "rxjs/Observable";
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response} from "@angular/http";
import { pathJoin } from "../../a-runtime-console/kubernetes/model/utils";
import * as jwt_decode from 'jwt-decode';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.less'],
  providers: [ GettingStartedService, ProviderService ]
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  authGitHub: boolean = false;
  authOpenShift: boolean = false;
  gitHubLinked: boolean = false;
  loggedInUser: User;
  openShiftLinked: boolean = false;
  registrationCompleted: boolean = true;
  showGettingStarted: boolean = false;
  subscriptions: Subscription[] = [];
  username: string;
  usernameInvalid: boolean = false;
  accessToken: string;
  redirect: string;
  linkingApiURL: string; 
  formMethod: string = "POST";
  githubURL: string = "https://github.com";
  openShiftURL: string;
  oldLinkingServer : string;


  // handle startup on kubernetes
  kubeMode: boolean = false;
  kubePollTimer: Observable<number>;
  kubePollSubscription: Subscription;
  kubePollMessage: string = "";

  constructor(
      private auth: AuthenticationService,
      private gettingStartedService: GettingStartedService,
      private logger: Logger,
      private fabric8UIConfig: Fabric8UIConfig,
      private http: Http,
      private providerService: ProviderService,
      private notifications: Notifications,
      private router: Router,
      @Inject(AUTH_API_URL) apiUrl: string,
      private userService: UserService) {

    // will be used to connect OpenShift Online.
    this.oldLinkingServer = apiUrl;

    // will be used in the non-angular html FORM's ACTION during the POST request
    // to connect GitHub
    this.linkingApiURL = apiUrl + 'token/link';

    this.redirect = window.location.origin + "/_gettingstarted?wait=true";     

    if (fabric8UIConfig) {
      this.openShiftURL = fabric8UIConfig.tenantApiUrl;
      let flag = fabric8UIConfig["kubernetesMode"];
      if (flag === "true") {
        this.kubeMode = true;
      }
    }

    if (!this.kubeMode) {
      // Still need to retrieve OpenShift token for checkbox, in case the GitHub token cannot be obtained below.
      this.subscriptions.push(auth.openShiftToken.subscribe(token => {
        this.openShiftLinked = (token !== undefined && token.length !== 0);
      }));
    } else {
      // lets poll for the kube tenant connected when the lazily created Jenkins endpoint
      // can be registered into KeyCloak
      this.kubePollTimer = Observable.timer(2000, 5000);
      this.kubePollSubscription = this.kubePollTimer.subscribe(t=> this.kubeTenantConnectPoll())}
      this.kubeTenantConnectPoll();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    // Route to home if registration is complete.
    this.userService.loggedInUser
      .map(user => {
        this.loggedInUser = user;
        this.username = this.loggedInUser.attributes.username;
        this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;

        // Probably should put it somewhere where the 
        // code would surely be executed if logged in.
        this.accessToken = localStorage.getItem("auth_token");
      
        // Todo: Remove after summit?
        if (!this.registrationCompleted) {
          this.saveUsername();
        }
      })
      .switchMap(() => this.auth.gitHubToken)
      .map(token => {
        this.gitHubLinked = (token !== undefined && token.length !== 0);
      })
      .switchMap(() => this.auth.openShiftToken)
      .map(token => {
        if (!this.kubeMode) {
          this.openShiftLinked = (token !== undefined && token.length !== 0);
        }
      })
      .do(() => {
        this.routeToHomeIfCompleted();
      })
      .publish().connect();

    // Page is hidden by default to prevent flashing, but must show if tokens cannot be obtained.
    setTimeout(() => {
      if (this.isUserGettingStarted()) {
        this.showGettingStarted = true;
      }
    }, 1000);
  }

  /**
   * Helper to test if connect accounts button should be disabled
   *
   * @returns {boolean}
   */
  get isConnectAccountsDisabled(): boolean {
    return !(this.authGitHub && !this.gitHubLinked || this.authOpenShift && !this.openShiftLinked)
      || (this.gitHubLinked && this.openShiftLinked);

  }

  /**
   * Helper to test if the successful state panel should be shown
   *
   * @returns {boolean} If the user has completed the getting started page
   */
  get isSuccess(): boolean {
    return (this.registrationCompleted && this.gitHubLinked && this.openShiftLinked);
  }

  /**
   * Helper to test if username button should be disabled
   *
   * @returns {boolean}
   */
  get isUsernameDisabled(): boolean {
    return this.registrationCompleted;
  }

  // Actions

  /**
   * Link GitHub and/or OpenShift accounts
   */
  connectAccounts(): boolean {

    // This method is called on form submit.
    // If Github Or Github+OSO is being linked, then form POST is done to /api/token/link.
    // If only OSO is being linked, then form POST is prevented and a redirection is used.
    
  
    if ( (this.authOpenShift && !this.openShiftLinked) && (this.authGitHub && !this.gitHubLinked) ){  

        console.log("Both openshift and github to be linked");

        let finalRedirect = window.location.origin + "/_gettingstarted?wait=true";     

        let parsedToken = jwt_decode(this.auth.getToken());
      
        // code repition, but temporary.
        // Will soon migrate this to use the new way of 
        // linking using the auth service.
        let url = `${this.oldLinkingServer}/link/session?`
          + "clientSession=" + parsedToken.client_session
          + "&sessionState=" + parsedToken.session_state
          + "&redirect=" + finalRedirect // brings us back to Getting Started.
          + "&provider=openshift-v3";
        
        this.redirect = url; // triggeres OSO linking the old-fashioned way after github linking.
        return true;
        
    }
    if (this.authOpenShift && !this.openShiftLinked) {
      console.log("only openshift to be linked")
      this.providerService.linkOpenShift(window.location.origin + "/_gettingstarted?wait=true");

      // disable FORM behaviour ( not really needed since browser would have been redirected 
      // before this line is reached )
      return false;
    }
    console.log("only github to be linked")    
    return true;
  }

  /**
   * Helpfer to route to home page
   */
  routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  /**
   * Save username
   */
  saveUsername(): void {
    this.usernameInvalid = !this.isUsernameValid();
    if (this.usernameInvalid) {
      return;
    }
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;
    profile.registrationCompleted = true;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
      this.loggedInUser = user;
      //Since we don't allow the user to change their username then we shouldn't tell them they did
      // if (this.username === user.attributes.username) {
      //   this.notifications.message({
      //     message: `Username updated!`,
      //     type: NotificationType.SUCCESS
      //   } as Notification);
      // }
    }, error => {
      this.username = this.loggedInUser.attributes.username;
      if (error.status === 403) {
        this.handleError("Username cannot be updated more than once", NotificationType.WARNING);
      } else if (error.status === 409) {
        this.handleError("Username already exists", NotificationType.DANGER);
      } else {
        this.handleError("Failed to update username", NotificationType.DANGER);
      }
    }));
  }

  // Private

  /**
   * Helper to retrieve request parameters
   *
   * @param name The request parameter to retrieve
   * @returns {any} The request parameter value or null
   */
  private getRequestParam(name: string): string {
    let param = (new RegExp('[?&]' + encodeURIComponent(name) + '=([^&]*)')).exec(window.location.search);
    if (param != null) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  /**
   * Helper to determin if we're on the getting started page
   *
   * @returns {boolean} True if the getting started page is shown
   */
  private isGettingStartedPage(): boolean {
    return (this.router.url.indexOf("_gettingstarted") !== -1);
  }

  /**
   * Helper to determine if getting started page should be shown or forward to the home page.
   *
   * @returns {boolean}
   */
  private isUserGettingStarted(): boolean {
    let wait = this.getRequestParam("wait");
    return !(wait === null && this.registrationCompleted === true
      && this.gitHubLinked === true && this.openShiftLinked === true);
  }

  /**
   * Helper to test if username is valid
   *
   * @returns {boolean}
   */
  private isUsernameValid(): boolean {
    // Dot and @ characters are valid
    return (this.username !== undefined
      && this.username.trim().length !== 0
      && this.username.trim().length < 63
      && this.username.trim().indexOf("-") !== 0
      && this.username.trim().indexOf("_") !== 0);
  }

  /**
   * Helpfer to route to home page if getting started is completed
   */
  private routeToHomeIfCompleted(): void {
    // Ensure subscription doesn't route to home should tokens be updated before ngOnDestroy
    if (this.isGettingStartedPage() && !this.isUserGettingStarted()) {
      this.routeToHome();
    }
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

  /**
   * Lets poll the fabric8-tenant service to see if the kubernetes tenant has connected the
   * services such as Jenkins into KeyCloak which is typically lazy after the tenant
   * starts to be created
   */
  private kubeTenantConnectPoll() {
    let bearerToken = this.authBearerToken();
    if (!bearerToken) {
      this.kubePollMessage = "Not logged in!";
      return;
    }

    var url = this.fabric8UIConfig.tenantApiUrl;
    if (!url) {
      this.kubePollMessage = "No tenant service configured!";
      return;
    }
    url = pathJoin(url, "/api/tenant/kubeconnect");

    let options = new RequestOptions({
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': bearerToken
      })
    });
    this.http.get(url, options). //.catch((err) => this.handleConnectPollError(err)).
      subscribe((response: Response) => {
        this.parseKubeConnectResponse(response, "Waiting...");
        let status = response.status;
        if (status == 200) {
          console.log("Successfully polled the kubernetes tenant connection!");
          this.openShiftLinked = true;
          if (this.kubePollSubscription) {
            this.kubePollSubscription.unsubscribe();
            this.kubePollSubscription = null;
          }
        }
      }, (err => {
        this.handleConnectPollError(err)
      }));
  }

  private parseKubeConnectResponse(response: Response, defaultMessage: string) {
    this.kubePollMessage = "";
    try {
      let body = response.json();
      if (body) {
        let data = body['data'] || {};
        let attributes = data['attributes'] || {};
        this.kubePollMessage = attributes["message"] || "";
      }
      if (!this.kubePollMessage) {
        this.kubePollMessage = defaultMessage;
      }
    } catch (e) {
      this.kubePollMessage = "Failed to parse response: " + e;
    }
  }

  private handleConnectPollError(err: Response) {
    this.parseKubeConnectResponse(err, "Cannot find tenant connected status due to " + err);
  }

  private authBearerToken(): string {
    if (this.auth.isLoggedIn()) {
      let token = this.auth.getToken();
      if (token) {
        return `Bearer ${token}`;
      }
    }
    return null;
  }

}
