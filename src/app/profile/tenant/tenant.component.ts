import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { TenentService } from '../services/tenent.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-update',
  templateUrl: 'tenant.component.html',
  styleUrls: ['./tenant.component.less'],
  providers: [CopyService, GettingStartedService, GitHubService, ProviderService, TenentService]
})
export class TenantComponent implements AfterViewInit, OnInit {
  @ViewChild('_jenkinsVersion') jenkinsVersionElement: HTMLElement;
  @ViewChild('_cheVersion') cheVersionElement: HTMLElement;
  @ViewChild('_teamVersion') teamVersionElement: HTMLElement;
  @ViewChild('_mavenRepo') mavenRepoElement: ElementRef;
  @ViewChild('_boosterGitRef') boosterGitRefElement: HTMLElement;
  @ViewChild('_boosterGitRepo') boosterGitRepoElement: HTMLElement;

  @ViewChild('tenantForm') profileForm: NgForm;

  jenkinsVersion: string;
  cheVersion: string;
  teamVersion: string;
  mavenRepo: string;
  updateTenant: boolean = true;

  boosterGitRef: string;
  boosterGitRepo: string;

  context: Context;

  jenkinsVersionInvalid: boolean = false;
  cheVersionInvalid: boolean = false;
  teamVersionInvalid: boolean = false;
  mavenRepoInvalid: boolean = false;

  boosterGitRefInvalid: boolean = false;
  boosterGitRepoInvalid: boolean = false;

  loadedFormEmpty: boolean;

  gitHubLinked: boolean = false;
  imageUrl: string;
  loggedInUser: User;
  fullName: string;
  openShiftLinked: boolean = false;
  registrationCompleted: boolean = true;
  subscriptions: Subscription[] = [];
  token: string;
  username: string;
  url: string;
  private modifiedFromRequestParam: boolean = false;

  constructor(
      private auth: AuthenticationService,
      private gettingStartedService: GettingStartedService,
      private contexts: Contexts,
      private notifications: Notifications,
      private router: Router,
      private tenentService: TenentService,
      private userService: UserService) {
    this.subscriptions.push(contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      this.setUserProperties(user);
    }));
    this.subscriptions.push(auth.gitHubToken.subscribe(token => {
      this.gitHubLinked = (token !== undefined && token.length !== 0);
    }));
    this.subscriptions.push(auth.openShiftToken.subscribe(token => {
      this.openShiftLinked = (token !== undefined && token.length !== 0);
    }));
  }

  ngAfterViewInit(): void {
    // Set focus
    if (this.getRequestParam('jenkinsVersion') !== null) {
      this.setElementFocus(null, this.jenkinsVersionElement);
    } else if (this.getRequestParam('boosterGitRef') !== null) {
      this.setElementFocus(null, this.boosterGitRefElement);
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


  get isUpdateProfileDisabled(): boolean {
    if (this.modifiedFromRequestParam) {
      return false;
    }
    return ((!this.profileForm.dirty && !(!this.loadedFormEmpty && this.formValuesEmpty())) ||
            (this.jenkinsVersionInvalid || this.cheVersionInvalid || this.teamVersionInvalid || this.mavenRepoInvalid ||
              this.boosterGitRefInvalid || this.boosterGitRepoInvalid));
  }

  /**
   * Route to user profile
   */
  routeToProfile(): void {
    this.router.navigate(['/', this.context.user.attributes.username]);
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
   * Resets the profile back to empty values
   */

  resetProfile(): void {
    this.modifiedFromRequestParam = false;
    this.profileForm.reset();
    this.updateTenant = true;
  }

  /**
   * Update user profile
   */
  updateProfile(): void {
    let profile = this.getTransientProfile();
    let contextInformation = profile.contextInformation;
    if (!contextInformation) {
      contextInformation = {};
      profile.contextInformation = contextInformation;
    }

    var boosterCatalog = contextInformation['boosterCatalog'];
    if (!boosterCatalog) {
      boosterCatalog = {};
      contextInformation['boosterCatalog'] = boosterCatalog;
    }
    boosterCatalog['gitRef'] = this.boosterGitRef;
    boosterCatalog['gitRepo'] = this.boosterGitRepo;

    var tenantConfig = contextInformation['tenantConfig'];
    if (!tenantConfig) {
      tenantConfig = {};
      contextInformation['tenantConfig'] = tenantConfig;
    }
    tenantConfig['jenkinsVersion'] = this.jenkinsVersion;
    tenantConfig['cheVersion'] = this.cheVersion;
    tenantConfig['teamVersion'] = this.teamVersion;
    tenantConfig['mavenRepo'] = this.mavenRepo;
    tenantConfig['updateTenant'] = this.updateTenant;


    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.setUserProperties(user);

      this.subscriptions.push(this.tenentService.updateTenent()
        .subscribe(res => {
          this.notifications.message({
            message: `Tenant Updated!`,
            type: NotificationType.SUCCESS
          } as Notification);
          this.routeToProfile();
        }, error => {
          this.handleError('Failed to update tenent', NotificationType.DANGER);
        }));

    }, error => {
      if (error.status === 409) {
        this.handleError('Email already exists', NotificationType.DANGER);
      } else {
        this.handleError('Failed to update profile', NotificationType.DANGER);
      }
    }));
  }

  boosterGitRepoValidate(): void {
    this.boosterGitRefInvalid = !this.isUrlValid(this.boosterGitRepo);
  }

  mavenRepoValidate(): void {
    this.mavenRepoInvalid = !this.isUrlValid(this.mavenRepo);
  }

  // Private

  /**
   * lets default values from request parameters
   */
  private defaultValuesFromRequestParams() {
    this.modifiedFromRequestParam = false;
    this.cheVersion = this.defaultRequestParam('cheVersion', this.cheVersion);
    this.jenkinsVersion = this.defaultRequestParam('jenkinsVersion', this.jenkinsVersion);
    this.teamVersion = this.defaultRequestParam('teamVersion', this.teamVersion);
    this.mavenRepo = this.defaultRequestParam('mavenRepo', this.mavenRepo);

    this.boosterGitRef = this.defaultRequestParam('boosterGitRef', this.boosterGitRef);
    this.boosterGitRepo = this.defaultRequestParam('boosterGitRepo', this.boosterGitRepo);
  }

  private defaultRequestParam(paramName: string, defaultValue: string): string {
    let answer = this.getRequestParam(paramName);
    if (answer) {
      this.modifiedFromRequestParam = true;
      return answer;
    } else {
      return defaultValue;
    }
  }


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
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    delete profile.username;
    return profile;
  }


  /**
   * Set user properties
   *
   * @param user
   */
  private setUserProperties(user: User): void {
    this.modifiedFromRequestParam = false;
    if (user.attributes === undefined) {
      return;
    }

    var contextInformation = user.attributes['contextInformation'];
    if (!contextInformation) {
      contextInformation = {};
      user.attributes['contextInformation'] = contextInformation;
    }

    let boosterCatalog = contextInformation['boosterCatalog'];
    if (boosterCatalog) {
      this.boosterGitRef = boosterCatalog['gitRef'] || '';
      this.boosterGitRepo = boosterCatalog['gitRepo'] || '';
    }

    let tenantConfig = contextInformation['tenantConfig'];
    if (tenantConfig) {
      this.jenkinsVersion = tenantConfig['jenkinsVersion'] || '';
      this.cheVersion = tenantConfig['cheVersion'] || '';
      this.teamVersion = tenantConfig['teamVersion'] || '';
      this.mavenRepo = tenantConfig['mavenRepo'] || '';
      this.updateTenant = tenantConfig['updateTenant'] || false;
    }

    this.loadedFormEmpty = this.formValuesEmpty();


    this.defaultValuesFromRequestParams();
  }

  /**
   * Helper to test if URL is valid
   *
   * @returns {boolean}
   */
  private isUrlValid(url: string): boolean {
    var trimmed = '';
    if (url) {
      trimmed = url.trim();
    }
    if (!trimmed) {
      return true;
    }
    return trimmed.startsWith('http:') || trimmed.startsWith('https:');
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

  private formValuesEmpty() {
    return !(this.boosterGitRef || this.boosterGitRepo ||
      this.jenkinsVersion || this.cheVersion || this.teamVersion || this.mavenRepo || !this.updateTenant);
  }

}
