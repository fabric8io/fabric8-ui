import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Context } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';
import { ExtProfile, GettingStartedService } from '../../../getting-started/services/getting-started.service';

import { ProviderService } from '../../../shared/account/provider.service';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-feature-opt-in',
  templateUrl: './feature-opt-in.component.html',
  styleUrls: ['./feature-opt-in.component.less']
})
export class FeatureOptInComponent implements OnInit, OnDestroy {

  public featureLevel: string;
  private subscriptions: Subscription[] = [];

  constructor(
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications,
    private userService: UserService
  ) {}

  updateProfile(): void {
    let profile = this.getTransientProfile();
    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }
    profile.featureLevel = this.featureLevel;

    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.userService.currentLoggedInUser = user;
      this.notifications.message({
        message: `Profile updated!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, error => {
      this.handleError('Failed to update profile', NotificationType.DANGER);
    }));
  }

  private getTransientProfile(): ExtProfile {
    let profile = this.gettingStartedService.createTransientProfile();
    // Delete extra information that make the update fail if present
    delete profile.username;
    if (profile) {
      delete profile['registrationCompleted'];
    }

    return profile;
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

  ngOnInit(): void {
    this.featureLevel = this.gettingStartedService.createTransientProfile().featureLevel;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
