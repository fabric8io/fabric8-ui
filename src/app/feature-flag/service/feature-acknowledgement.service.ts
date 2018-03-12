import { ErrorHandler, Inject, Injectable, OnDestroy } from '@angular/core';
import { Http } from '@angular/http';
import { ExtProfile, GettingStartedService } from '../../getting-started/services/getting-started.service';

import { Logger } from 'ngx-base';
import { WIT_API_URL } from 'ngx-fabric8-wit';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Observable, Subscription } from 'rxjs';

/**
 * A service to manage the user acknowledgement to dismiss the warning displayed by the experimental feature banner
 */
@Injectable()
export class FeatureAcknowledgementService extends GettingStartedService implements OnDestroy {
  subscriptions: Subscription[] = [];

  constructor(
      protected auth: AuthenticationService,
      protected http: Http,
      protected logger: Logger,
      private errorHandler: ErrorHandler,
      protected userService: UserService,
      @Inject(WIT_API_URL) apiUrl: string) {
    super(auth, http, logger, userService, apiUrl);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Returns user acknowledgement
   *
   * @param {string} featureName The name of the experimental feature
   * @returns {boolean} True if the user acknowledged a warning for the given feature
   */
  getAcknowledgement(featureName: string): boolean {
    if (featureName === undefined || featureName.length === 0) {
      return false;
    }
    let acknowledged: boolean = false;
    let profile = this.getTransientProfile();
    if (profile && profile.contextInformation === undefined) {
      return acknowledged;
    }
    if (profile && profile.contextInformation.featureAcknowledgement !== undefined) {
      acknowledged = Boolean(profile.contextInformation.featureAcknowledgement[featureName]);
    }
    return acknowledged;
  }

  /**
   * Save user acknowledgement
   *
   * @param {string} featureName The name of the experimental feature
   * @param {boolean} acknowledged True if the user acknowledged a warning for the given feature
   */
  setAcknowledgement(featureName: string, acknowledged: boolean): void {
    if (featureName === undefined || featureName.length === 0) {
      return;
    }
    let profile = this.getTransientProfile();
    if (profile && profile.contextInformation.featureAcknowledgement === undefined) {
      profile.contextInformation.featureAcknowledgement = {};
    }
    if (profile) {
      profile.contextInformation.featureAcknowledgement[featureName] = acknowledged;
    }

    this.subscriptions.push(this.update(profile).subscribe(user => {
      // Do nothing
    }, error => {
      this.logger.error('Failed to save acknowledge state');
      this.errorHandler.handleError(error);
    }));
  }

  // Private

  /**
   * Get transient profile with updated properties
   *
   * @returns {ExtProfile} The updated transient profile
   */
  private getTransientProfile(): ExtProfile {
    let profile = this.createTransientProfile();
    if (profile && profile.username) {
      delete profile.username;
    }

    return profile;
  }
}
