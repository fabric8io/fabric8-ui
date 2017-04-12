import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

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
export class GettingStartedComponent implements OnInit {

  authGitHub: boolean = false;
  authOpenShift: boolean = false;
  gettingStartedCompleted: boolean = false;
  gitHubLinked: boolean = false;
  loggedInUser: User;
  openShiftLinked: boolean = false;
  registrationCompleted: boolean = false;
  showGettingStarted: boolean = false;
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
    userService.loggedInUser.subscribe(user => {
      if (user === undefined || user.attributes === undefined) {
        return;
      }
      this.loggedInUser = user;
      this.username = this.loggedInUser.attributes.username;
      this.registrationCompleted = (user as ExtUser).attributes.registrationCompleted;
    });
    auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    });
    auth.openShiftToken.subscribe(token => {
      this.openShiftLinked = (token !== undefined && token.length !== 0);
    });
    this.isGettingStarted().subscribe(val => {
      this.showGettingStarted = val;
      if (!this.showGettingStarted) {
        this.routeToHome();
      }
    });
  }

  ngOnInit() {
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

    this.gettingStartedService.update(profile).subscribe(user => {
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
      } else {
        this.handleError("Failed to update username", NotificationType.DANGER);
      }
    });
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
   * @returns {Observable<boolean>}
   */
  private isGettingStarted(): Observable<boolean> {
    let wait = this.getRequestParam("wait");
    return Observable.combineLatest(
      Observable.of(wait).map(val => val),
      Observable.of(this.gitHubLinked).map(val => val),
      Observable.of(this.openShiftLinked).map(val => val),
      (a, b, c) => !(a === null && b === true && c === true)
    );
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

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
