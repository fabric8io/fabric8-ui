import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';
import { ProviderService } from '../../shared/account/provider.service';
import { GitHubService } from '../../space/create/codebases/services/github.service';
import { CopyService } from '../services/copy.service';
import { TenantService } from '../services/tenant.service';

export enum TenantUpdateStatus {
  NoAction,
  Updating,
  Success,
  Failure
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-update',
  templateUrl: 'update.component.html',
  styleUrls: ['./update.component.less'],
  providers: [CopyService, GettingStartedService, GitHubService, TenantService]
})
export class UpdateComponent implements AfterViewInit, OnInit {
  // Required for usage of enums in the template.
  TenantUpdateStatus = TenantUpdateStatus;

  @ViewChild('_email') emailElement: ElementRef;
  @ViewChild('_bio') bioElement: HTMLElement;
  @ViewChild('_imageUrl') imageUrlElement: ElementRef;
  @ViewChild('_url') urlElement: ElementRef;
  @ViewChild('profileForm') profileForm: NgForm;
  @ViewChild('advancedForm') advancedForm: NgForm;

  authGitHub: boolean = false;
  authOpenShift: boolean = false;
  bio: string;
  company: string;
  companyInvalid: boolean = false;
  context: Context;
  email: string;
  emailPrivate: boolean = true;
  emailVerified: boolean;
  emailInvalid: boolean = false;
  featureLevel: string;
  gitHubLinked: boolean = false;
  imageUrl: string;
  imageUrlInvalid: boolean = false;

  loggedInUser: User;
  fullName: string;
  fullNameInvalid: boolean = false;
  openShiftLinked: boolean = false;

  subscriptions: Subscription[] = [];
  token: string;
  tokenPanelOpen: boolean = false;
  updateTenantStatus: TenantUpdateStatus = TenantUpdateStatus.NoAction;
  username: string;

  url: string;
  urlInvalid: boolean = false;

  constructor(
      private auth: AuthenticationService,
      private copyService: CopyService,
      private gettingStartedService: GettingStartedService,
      private contexts: Contexts,
      private gitHubService: GitHubService,
      private notifications: Notifications,
      private providerService: ProviderService,
      private renderer: Renderer2,
      private router: Router,
      private tenantService: TenantService,
      private userService: UserService) {
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));

    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    }));

    if (userService.currentLoggedInUser.attributes) {
      this.loggedInUser = userService.currentLoggedInUser;
      this.setUserProperties(this.loggedInUser);
      this.subscriptions.push(auth.isOpenShiftConnected(this.loggedInUser.attributes.cluster).subscribe((isConnected) => {
        this.openShiftLinked = isConnected;
      }));
    }
  }

  ngAfterViewInit(): void {
    // Set focus
    if (this.getRequestParam('bio') !== null) {
      this.setElementFocus(null, this.bioElement);
    } else if (this.getRequestParam('email') !== null) {
      this.setElementFocus(null, this.emailElement.nativeElement);
    } else if (this.getRequestParam('imageUrl') !== null) {
      this.setElementFocus(null, this.imageUrlElement.nativeElement);
    } else if (this.getRequestParam('url') !== null) {
      this.setElementFocus(null, this.urlElement.nativeElement);
    }
  }

  ngOnInit() {
    this.token = this.auth.getToken();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
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

  get isUpdateProfileDisabled(): boolean {
    return ((!this.profileForm.dirty && !this.advancedForm.dirty) ||
            (this.emailInvalid || this.imageUrlInvalid || this.urlInvalid));
  }

  // Actions

  /**
   * Link GitHub and/or OpenShift accounts
   */
  connectAccounts(): void {
    // Todo: Still cannot refresh current page, so send user to getting started page
    if (this.authGitHub && !this.gitHubLinked && this.authOpenShift && !this.openShiftLinked) {
      this.providerService.linkAll(this.loggedInUser.attributes.cluster, window.location.origin + '/_gettingstarted?wait=true');
    } else if (this.authGitHub && !this.gitHubLinked) {
      this.providerService.linkGitHub(window.location.origin + '/_gettingstarted?wait=true');
    } else if (this.authOpenShift && !this.openShiftLinked) {
      this.providerService.linkOpenShift(this.loggedInUser.attributes.cluster, window.location.origin + '/_gettingstarted?wait=true');
    }
  }

  /**
   * Copy token to the user's system clipboard
   */
  copyTokenToClipboard(): void {
    let result = this.copyService.copy(this.token);
    if (result) {
      this.notifications.message({
        message: `Token copied!`,
        type: NotificationType.SUCCESS
      } as Notification);
    } else {
      this.handleError('Failed to copy token', NotificationType.DANGER);
    }
  }

  /**
   * Handle bio change
   *
   * @param $event The new bio
   */
  handleBioChange($event: string): void {
    this.profileForm.form.markAsDirty();
    this.bio = $event;
  }

  linkImageUrl(): void {
    this.subscriptions.push(this.gitHubService.getUser().subscribe(user => {
      if (user.avatar_url !== undefined && user.avatar_url.length > 0) {
        this.profileForm.form.markAsDirty();
        this.imageUrl = user.avatar_url;
      } else {
        this.handleError('No image found', NotificationType.INFO);
      }
    }, error => {
      this.handleError('Unable to link image', NotificationType.WARNING);
    }));
  }

  /**
   * Route to user profile
   */
  routeToProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username]);
  }

  resetPasswordUrl(): void {
    window.open('https://developers.redhat.com/auth/realms/rhd/account/password');
  }

  /**
   * Set element focus to given HTML elment
   *
   * @param $event The triggered event
   * @param element The component or HTML element to set focus
   */
  setElementFocus($event: MouseEvent, element: any) {
    if (element instanceof HTMLElement) {
      (element as HTMLElement).focus();
    }
  }

  /**
   * Toggle token panel open and close
   */
  toggleTokenPanel(): void {
    this.tokenPanelOpen = !this.tokenPanelOpen;
  }

  /**
   * Update user profile
   */
  updateProfile(): void {
    let profile = this.getTransientProfile();
    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }
    profile.featureLevel = this.featureLevel;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.userService.currentLoggedInUser = user;
      this.setUserProperties(user);
      this.notifications.message({
        message: `Profile updated!`,
        type: NotificationType.SUCCESS
      } as Notification);
      this.routeToProfile();
    }, error => {
      if (error.status === 409) {
        this.handleError('Email already exists', NotificationType.DANGER);
      } else {
        this.handleError('Failed to update profile', NotificationType.DANGER);
      }
    }));
  }

  /**
   * Update tenant
   */
  updateTenant(): void {
    this.updateTenantStatus = TenantUpdateStatus.Updating;
    this.subscriptions.push(this.tenantService.updateTenant()
      .subscribe(res => {
        if (res.status === 200) {
          this.updateTenantStatus = TenantUpdateStatus.Success;
          this.notifications.message({
            message: `Profile updated!`,
            type: NotificationType.SUCCESS
          } as Notification);
        } else {
          this.updateTenantStatus = TenantUpdateStatus.Failure;
          this.notifications.message({
            message: `Error updating tenant`,
            type: NotificationType.DANGER
          } as Notification);
        }
      }, error => {
        this.updateTenantStatus = TenantUpdateStatus.Failure;
        this.handleError('Unexpected error updating tenant', NotificationType.DANGER);
      }));
  }

  /**
   * Cleanup tenant
   */
  cleanupTenant(): void {
    this.router.navigate(['/', this.context.user.attributes.username, '_cleanup']);
  }

  /**
   * Validate email
   */
  validateEmail(): void {
    this.emailInvalid = !this.isEmailValid(this.email);
  }

  /**
   * Validate image URL
   */
  validateImageUrl(): void {
    this.imageUrlInvalid = !this.isImageUrlValid();
  }

  /**
   * Validate URL
   */
  validateUrl(): void {
    this.urlInvalid = !this.isUrlValid();
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
    if (param != undefined) {
      return decodeURIComponent(param[1]);
    }
    return null;
  }

  /**
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    // Delete extra information that make the update fails if present
    delete profile.username;
    if (profile) {
      delete profile['registrationCompleted'];
    }
    if (this.bio !== undefined && this.bio.length > 0) {
      profile.bio = this.bio.trim();
    }
    if (this.company !== undefined && this.company.length > 0) {
      profile.company = this.company.trim();
    }
    if (this.email !== undefined && this.email.trim().length > 0) {
      profile.email = this.email.trim();
    }
    if (this.fullName !== undefined && this.fullName.length > 0) {
      profile.fullName = this.fullName.trim();
    }
    if (this.imageUrl !== undefined && this.imageUrl.length > 0) {
      profile.imageURL = this.imageUrl.trim();
    }
    if (this.url !== undefined && this.url.length > 0) {
      profile.url = this.url.trim();
    }
    if (this.emailPrivate !== undefined) {
      profile.emailPrivate = this.emailPrivate;
    }
    return profile;
  }

  /**
   * Helper to test if email is valid
   *
   * @returns {boolean}
   */
  public isEmailValid(email: string): boolean {
    // Email validation regex modified from: http://emailregex.com/
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.trim());
  }

  /**
   * Helper to test if image URL is valid
   *
   * @returns {boolean}
   */
  private isImageUrlValid(): boolean {
    if (this.imageUrl !== undefined && this.imageUrl.trim().length > 0) {
      return (this.imageUrl.trim().indexOf('http') === 0);
    } else {
      return true;
    }
  }

  /**
   * Helper to test if URL is valid
   *
   * @returns {boolean}
   */
  private isUrlValid(): boolean {
    if (this.url !== undefined && this.url.trim().length > 0) {
      return (this.url.trim().indexOf('http') === 0);
    } else {
      return true;
    }
  }

  /**
   * Set user properties
   *
   * @param user
   */
  private setUserProperties(user: User): void {
    if (user.attributes === undefined) {
      return;
    }

    this.bio = (user.attributes.bio !== undefined) ? user.attributes.bio : '';
    this.company = (user.attributes.company !== undefined) ? user.attributes.company : '';
    this.email = (user.attributes.email !== undefined) ? user.attributes.email : '';
    this.emailPrivate = (user.attributes.emailPrivate !== undefined) ? user.attributes.emailPrivate : true;
    this.emailVerified = ((user as any).attributes.emailVerified !== undefined) ?
      (user as any).attributes.emailVerified : false;
    this.fullName = (user.attributes.fullName !== undefined) ? user.attributes.fullName : '';
    this.imageUrl = (user.attributes.imageURL !== undefined) ? user.attributes.imageURL : '';
    this.url = (user.attributes.url !== undefined) ? user.attributes.url : '';
    this.username = (user.attributes.username !== undefined) ? user.attributes.username : '';

    if (user
      && user.attributes
      && (user.attributes as any).featureLevel) {
        this.setFeatureLevel((user.attributes as any).featureLevel);
    }
  }

  private setFeatureLevel(level) {
    switch (level) {
      case 'beta': {
        this.featureLevel = 'beta';
        break;
      }
      case 'experimental': {
        this.featureLevel = 'experimental';
        break;
      }
      case 'internal': {
        this.featureLevel = 'internal';
        break;
      }
      default: {
        this.featureLevel = 'released';
        break;
      }
    }
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
