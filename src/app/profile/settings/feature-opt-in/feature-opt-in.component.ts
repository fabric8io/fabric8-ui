import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { UserService } from 'ngx-login-client';
import { ListComponent, ListConfig } from 'patternfly-ng';
import { Subscription } from 'rxjs';
import { FeatureAcknowledgementService } from '../../../feature-flag/service/feature-acknowledgement.service';
import { ExtProfile, GettingStartedService } from '../../../getting-started/services/getting-started.service';

interface FeatureLevel {
  name: string;
  selected: boolean;
  title: string;
  description: string;
  detailDescription: string;
  features: any[];
  displayed: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-feature-opt-in',
  templateUrl: './feature-opt-in.component.html',
  styleUrls: ['./feature-opt-in.component.less']
})
export class FeatureOptInComponent implements OnInit, OnDestroy {

  @ViewChild(ListComponent) listComponent: ListComponent;

  public featureLevel: string;
  private subscriptions: Subscription[] = [];
  listConfig: ListConfig;
  private items: FeatureLevel[];

  state: boolean;

  constructor(
    private gettingStartedService: GettingStartedService,
    private notifications: Notifications,
    private userService: UserService,
    private toggleService: FeatureTogglesService,
    private toggleServiceAck: FeatureAcknowledgementService
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
    if (event.selectedItems.length === 0) {
      // Do not allow item deselection events - one item should always be selected. If a
      // deselection occurs, re-select the item and ignore the event.
      this.listComponent.selectItem(event.item, true);
      return;
    }
    this.featureLevel = event.item.name;
    let profile = this.getTransientProfile();
    this.subscriptions.push(this.gettingStartedService.update(profile).subscribe(user => {
      this.userService.currentLoggedInUser = user;
      this.notifications.message({
        message: `Profile updated!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, error => {
      this.notifications.message({
        message: 'Failed to update profile',
        type: NotificationType.DANGER
      } as Notification);
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

  ngOnInit(): void {
    this.toggleServiceAck.getToggle().subscribe(val => {
      this.state = val;
    });
    this.featureLevel =  (this.userService.currentLoggedInUser.attributes as ExtProfile).featureLevel;
    this.items = [
      {
        name: 'released',
        selected: this.featureLevel === 'released',
        title: 'Production-Only Features',
        description: 'Use the generally available version of OpenShift.io.',
        detailDescription: 'These features have been released and are part of the product release.',
        features: [],
        displayed: true
      },
      {
        name: 'beta',
        selected: this.featureLevel === 'beta',
        title: 'Beta Features',
        description: 'Enable early access to beta features that are stable but still being tested.',
        detailDescription: `
                These features are currently in beta testing and have no guarantee of performance or stability.<br/>
                Use these at your own risk.`,
        features: [],
        displayed: true
      },
      {
        name: 'experimental',
        selected: this.featureLevel === 'experimental',
        title: 'Experimental Features',
        description: 'Enable access to experimental features that are in the early stages of testing and may not work as expected.',
        detailDescription: `
                These features are currently in experimental testing and have no guarantee of performance or stability.<br/>
                Use these at your own risk.`,
        features: [],
        displayed: true
      },
      {
        name: 'internal',
        selected: this.featureLevel === 'internal',
        title: 'Internal Experimental Features',
        description: 'Enable access to experimental features that are only available to internal Red Hat users.',
        detailDescription: `
                These features are currently in internal testing and have no guarantee of performance or stability.<br/>
                Use these at your own risk.`,
        features: [],
        displayed:  this.userService.currentLoggedInUser.attributes.email.endsWith('redhat.com') && (this.userService.currentLoggedInUser.attributes as any).emailVerified
      }
    ];

    this.subscriptions.push(this.toggleService.getAllFeaturesEnabledByLevel()
      .subscribe(features => {
      let featurePerLevel = this.featureByLevel(features as Feature[]);
      for (let item of this.items) {
        item.features = featurePerLevel[item.name];
      }
    }));
  }

  onChange(event: {previousValue: boolean, currentValue: boolean}): void {
    this.toggleServiceAck.setToggle(event.currentValue);
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
