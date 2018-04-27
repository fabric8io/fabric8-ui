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
  private items = [
    {
      name: 'released',
      color: '',
      title: 'Production Only Features',
      description: 'This is the default and current release version of the product.',
      features: [],
      displayed: true
    },
    {
      name: 'beta',
      title: 'Beta Features',
      description: 'Experience various features that are ready for beta testing.',
      features: [],
      displayed: true
    },
    {
      name: 'experimental',
      title: 'Experimental Features',
      description: 'These features are still considered experimental and have no guarantee of stability.',
      features: [],
      displayed: true
    },
    {
      name: 'internal',
      title: 'Internal Experimental Features',
      description: 'These experimental features are released to internal employees only.',
      features: [],
      displayed:  this.userService.currentLoggedInUser.attributes.email.endsWith('redhat.com') && (this.userService.currentLoggedInUser.attributes as any).emailVerified
    }
  ];


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
      useExpandItems: false
    } as ListConfig;
  }

  updateProfile(): void {
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
    // TODO replace this service call with new endpoint
    // https://github.com/openshiftio/openshift.io/issues/3316
    // to avoid to have to list all features
    this.subscriptions.push(this.toggleService.getFeatures([
      'AppLauncher',
      'Analyze',
      'Analyze.newHomeDashboard',
      'Analyze.newSpaceDashboard',
      'Deployments',
      'Planner'
    ]).map(features => {
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
