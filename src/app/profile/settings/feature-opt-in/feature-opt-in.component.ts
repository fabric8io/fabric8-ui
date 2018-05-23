import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { UserService } from 'ngx-login-client';
import { ListConfig } from 'patternfly-ng';
import { Subscription } from 'rxjs';
import { Feature, FeatureTogglesService } from '../../../feature-flag/service/feature-toggles.service';
import { ExtProfile, GettingStartedService } from '../../../getting-started/services/getting-started.service';
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
  listConfig: ListConfig;
  private items;


  constructor(
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications,
    private userService: UserService,
    private toggleService: FeatureTogglesService
  ) {
    this.listConfig = {
      dblClick: false,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: false,
      showRadioButton: true,
      useExpandItems: true
    } as ListConfig;
  }

  updateProfile(event): void {
    this.featureLevel = event.item.name;
    let profile = this.getTransientProfile();
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
    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }
    if (this.featureLevel) {
      profile.featureLevel = this.featureLevel;
    }
    // Delete extra information that make the update fail if present
    delete profile.username;
    if (profile) {
      delete profile['registrationCompleted'];
    }

    return profile;
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }

  ngOnInit(): void {
    this.featureLevel =  (this.userService.currentLoggedInUser.attributes as ExtProfile).featureLevel;
    this.items = [
      {
        name: 'released',
        selected: this.featureLevel === 'released',
        color: '',
        title: 'Production-Only Features',
        description: 'Use the generally available version of OpenShift.io.',
        features: [],
        displayed: true
      },
      {
        name: 'beta',
        selected: this.featureLevel === 'beta',
        title: 'Beta Features',
        description: 'Enable early access to beta features that are stable but still being tested.',
        features: [],
        displayed: true
      },
      {
        name: 'experimental',
        selected: this.featureLevel === 'experimental',
        title: 'Experimental Features',
        description: 'Enable access to experimental features that are in the early stages of testing and may not work as expected.',
        features: [],
        displayed: true
      },
      {
        name: 'internal',
        selected: this.featureLevel === 'internal',
        title: 'Internal Experimental Features',
        description: 'Enable access to experimental features that are only available to internal Red Hat users.',
        features: [],
        displayed:  this.userService.currentLoggedInUser.attributes.email.endsWith('redhat.com') && (this.userService.currentLoggedInUser.attributes as any).emailVerified
      }
    ];

    this.subscriptions.push(this.toggleService.getAllFeaturesEnabledByLevel()
      .map(features => {
      let featurePerLevel = this.featureByLevel(features);
      for (let item of this.items) {
        item.features = featurePerLevel[item.name];
      }
      return features;
      })
      .subscribe(() => {}));
  }

  featureByLevel(features: Feature[]): any {
    let released: Feature[] = [];
    let internal: Feature[] = [];
    let experimental: Feature[] = [];
    let beta: Feature[] = [];
    for (let feature of features) {
      feature.attributes.name = feature.id.replace('.', ' ');
      switch (feature.attributes['enablement-level']) {
        case 'released': {
          if (feature.attributes['enabled']) {
            released.push(feature);
          }
          break;
        }
        case 'beta': {
          if (feature.attributes['enabled']) {
            beta.push(feature);
          }
          break;
        }
        case 'experimental': {
          if (feature.attributes['enabled']) {
            experimental.push(feature);
          }
          break;
        }
        case 'internal': {
          if (feature.attributes['enabled']) {
            internal.push(feature);
          }
          break;
        }
        default: {
          break;
        }
      }
    }
    return {
      internal,
      experimental,
      beta,
      released
    };
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }
}
