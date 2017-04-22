import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService, UserService, User } from 'ngx-login-client';

import { ExtUser, GettingStartedService } from './services/getting-started.service';
import { ProviderService } from './services/provider.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
  providers: [ GettingStartedService, ProviderService ]
})
export class GettingStartedComponent implements OnDestroy, OnInit {

  authGitHub: boolean = false;
  authOpenShift: boolean = false;
  gitHubLinked: boolean = false;
  loggedInUser: User;
  openShiftLinked: boolean = false;
  registrationCompleted: boolean = false;
  showGettingStarted: boolean = false;
  subscriptions: Subscription[] = [];
  username: string;
  usernameInvalid: boolean = false;

  constructor(
      private auth: AuthenticationService,
      private gettingStartedService: GettingStartedService,
      private logger: Logger,
      private providerService: ProviderService,
      private notifications: Notifications,
      private router: Router,
      private userService: UserService) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      if (user === undefined || user.attributes === undefined) {
        return;
      }
      this.loggedInUser = user;
      this.username = this.loggedInUser.attributes.username;
      this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
    }));
    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
      this.routeToHomeIfCompleted();
    }));
    this.subscriptions.push(auth.openShiftToken.subscribe(token => {
      this.openShiftLinked = (token !== undefined && token.length !== 0);
      this.routeToHomeIfCompleted();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  ngOnInit(): void {
    // Page is hidden by default to prevent flashing, but must show when tokens cannot be obtained.
    setTimeout(() => {
      if (this.isGettingStarted()) {
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
    return !this.usernameInvalid && this.gitHubLinked && this.openShiftLinked;
  }

  // Actions

  /**
   * Link GitHub and/or OpenShift accounts
   */
  connectAccounts(): void {
    if (this.authGitHub && !this.gitHubLinked && this.authOpenShift && !this.openShiftLinked) {
      this.providerService.linkAll(window.location.origin + "/_gettingstarted?wait=true");
    } else if (this.authGitHub && !this.gitHubLinked) {
      this.providerService.linkGitHub(window.location.origin + "/_gettingstarted?wait=true");
    } else if (this.authOpenShift && !this.openShiftLinked) {
      this.providerService.linkOpenShift(window.location.origin + "/_gettingstarted?wait=true");
    }
  }

  /**
   * Helpfer to route to home page
   */
  routeToHome(): void {
    this.router.navigate(['/', '_home']);
  }

  /**
   * Update username
   *
   * Note: This can only be done once per the user patch API
   */
  updateUsername(): void {
    this.usernameInvalid = !this.isUsernameValid();
    if (this.usernameInvalid) {
      return;
    }
    let profile = this.gettingStartedService.createTransientProfile();
    profile.username = this.username;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.loggedInUser = user;
      if (this.username === user.attributes.username) {
        this.notifications.message({
          message: `Username updated!`,
          type: NotificationType.SUCCESS
        } as Notification);
      }
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
   * Helper to determine if getting started page should be shown or forward to the home page.
   *
   * @returns {boolean}
   */
  private isGettingStarted(): boolean {
    let wait = this.getRequestParam("wait");
    return !(this.gitHubLinked === true && this.openShiftLinked === true && wait === null);
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
      && this.username.trim().indexOf("-") === -1
      && this.username.trim().indexOf("_") === -1);
  }

  /**
   * Helpfer to route to home page if getting started is completed
   */
  private routeToHomeIfCompleted(): void {
    if (!this.isGettingStarted()) {
      this.router.navigate(['/', '_home']);
    }
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
