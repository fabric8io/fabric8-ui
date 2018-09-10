import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Response } from '@angular/http';
import { Router } from '@angular/router';

import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { AuthenticationService, User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import {
  ExtProfile,
  ExtUser,
  GettingStartedService
} from '../../getting-started/services/getting-started.service';
import { GitHubService } from '../../space/create/codebases/services/github.service';
import { CopyService } from '../services/copy.service';
import { TenantService } from '../services/tenant.service';

import { gravatar } from '../../shared/gravatar/gravatar';
import { GitHubUser } from '../../space/create/codebases/services/github';

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
export class UpdateComponent implements OnInit, OnDestroy {
  // Required for usage of enums in the template.
  TenantUpdateStatus = TenantUpdateStatus;

  @ViewChild('profileForm')
  profileForm: NgForm;
  @ViewChild('advancedForm')
  advancedForm: NgForm;

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
  imageUrl: string;
  imageUrlInvalid: boolean = false;

  fullName: string;
  fullNameInvalid: boolean = false;

  subscriptions: Subscription[] = [];
  token: string;
  tokenPanelOpen: boolean = false;
  updateTenantStatus: TenantUpdateStatus = TenantUpdateStatus.NoAction;
  username: string;

  url: string;
  urlInvalid: boolean = false;
  selectedTab: number = 1;

  constructor(
    private auth: AuthenticationService,
    private copyService: CopyService,
    private gettingStartedService: GettingStartedService,
    private contexts: Contexts,
    private gitHubService: GitHubService,
    private notifications: Notifications,
    private router: Router,
    private tenantService: TenantService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.subscriptions.push(
      this.contexts.current.subscribe((ctx: Context) => {
        this.context = ctx;
      })
    );

    if (this.userService.currentLoggedInUser.attributes) {
      this.setUserProperties(this.userService.currentLoggedInUser);
    }
    this.token = this.auth.getToken();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => {
      sub.unsubscribe();
    });
  }

  get isUpdateProfileDisabled(): boolean {
    return (
      (!this.profileForm.dirty && !this.advancedForm.dirty) ||
      (this.emailInvalid || this.imageUrlInvalid || this.urlInvalid)
    );
  }

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

  linkGithubImageUrl(): void {
    this.subscriptions.push(
      this.gitHubService.getUser().subscribe(
        (user: GitHubUser) => {
          if (user.avatar_url !== undefined && user.avatar_url.length > 0) {
            this.profileForm.form.markAsDirty();
            this.imageUrl = user.avatar_url;
          } else {
            this.handleError('No image found', NotificationType.INFO);
          }
        },
        () => {
          this.handleError('Unable to link image', NotificationType.WARNING);
        }
      )
    );
  }

  linkGravatarImageUrl(): void {
    const avatar_url = gravatar(this.email);
    if (avatar_url !== undefined && avatar_url.length > 0) {
      this.profileForm.form.markAsDirty();
      this.imageUrl = avatar_url;
    } else {
      this.handleError('No image found', NotificationType.INFO);
    }
  }

  routeToProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username]);
  }

  resetPasswordUrl(): void {
    window.open(
      'https://developers.redhat.com/auth/realms/rhd/account/password'
    );
  }

  toggleTokenPanel(): void {
    this.tokenPanelOpen = !this.tokenPanelOpen;
  }

  updateProfile(): void {
    let profile = this.getTransientProfile();
    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }

    this.subscriptions.push(
      this.gettingStartedService.update(profile).subscribe(
        (user: ExtUser) => {
          this.userService.currentLoggedInUser = user;
          this.setUserProperties(user);
          this.notifications.message({
            message: `Profile updated!`,
            type: NotificationType.SUCCESS
          } as Notification);
          this.routeToProfile();
        },
        error => {
          if (error.status === 409) {
            this.handleError('Email already exists', NotificationType.DANGER);
          } else {
            this.handleError(
              'Failed to update profile',
              NotificationType.DANGER
            );
          }
        }
      )
    );
  }

  updateTenant(): void {
    this.updateTenantStatus = TenantUpdateStatus.Updating;
    this.subscriptions.push(
      this.tenantService.updateTenant().subscribe(
        res => {
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
        },
        () => {
          this.updateTenantStatus = TenantUpdateStatus.Failure;
          this.handleError(
            'Unexpected error updating tenant',
            NotificationType.DANGER
          );
        }
      )
    );
  }

  cleanupTenant(): void {
    this.router.navigate([
      '/',
      this.context.user.attributes.username,
      '_cleanup'
    ]);
  }

  validateEmail(): void {
    this.emailInvalid = !this.isEmailValid(this.email);
  }

  sendEmailVerificationLink(): void {
    this.subscriptions.push(
      this.userService.sendEmailVerificationLink().subscribe(
        (res: Response) => {
          if (res.status === 204) {
            this.notifications.message({
              message: `Email Verification link sent!`,
              type: NotificationType.SUCCESS
            } as Notification);
          } else {
            this.notifications.message({
              message: `Error sending email verification link!`,
              type: NotificationType.DANGER
            } as Notification);
          }
        },
        () => {
          this.handleError(
            'Unexpected error sending link!',
            NotificationType.DANGER
          );
        }
      )
    );
  }

  validateUrl(): void {
    this.urlInvalid = !this.isUrlValid();
  }

  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    // Delete extra information that make the update fails if present
    delete profile.username;
    if (profile) {
      delete profile['registrationCompleted'];
    }
    if (this.bio !== undefined) {
      profile.bio = this.bio.trim().substring(0, 255);
    }
    if (this.company !== undefined) {
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
    if (this.url !== undefined) {
      profile.url = this.url.trim();
    }
    if (this.emailPrivate !== undefined) {
      profile.emailPrivate = this.emailPrivate;
    }
    return profile;
  }

  public isEmailValid(email: string): boolean {
    // Email validation regex modified from: http://emailregex.com/
    const emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(email.trim());
  }

  private isUrlValid(): boolean {
    const urlRegex: RegExp = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/;
    if (this.url !== undefined && this.url.trim().length > 0) {
      return urlRegex.test(this.url.trim());
    } else {
      return true;
    }
  }

  private setUserProperties(user: User): void {
    if (user.attributes === undefined) {
      return;
    }

    this.bio = user.attributes.bio !== undefined ? user.attributes.bio : '';
    this.company =
      user.attributes.company !== undefined ? user.attributes.company : '';
    this.email =
      user.attributes.email !== undefined ? user.attributes.email : '';
    this.emailPrivate =
      user.attributes.emailPrivate !== undefined
        ? user.attributes.emailPrivate
        : true;
    this.emailVerified =
      (user as any).attributes.emailVerified !== undefined
        ? (user as any).attributes.emailVerified
        : false;
    this.fullName =
      user.attributes.fullName !== undefined ? user.attributes.fullName : '';
    this.imageUrl =
      user.attributes.imageURL !== undefined ? user.attributes.imageURL : '';
    this.url = user.attributes.url !== undefined ? user.attributes.url : '';
    this.username =
      user.attributes.username !== undefined ? user.attributes.username : '';
  }

  changeTab(tab): void {
    this.selectedTab = tab;
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
