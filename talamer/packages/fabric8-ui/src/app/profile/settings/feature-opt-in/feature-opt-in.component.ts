import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Notifications, NotificationType } from 'ngx-base';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { UserService } from 'ngx-login-client';
import { ListComponent, ListConfig, ListEvent } from 'patternfly-ng';
import { first } from 'rxjs/operators';
import { FeatureAcknowledgementService } from '../../../feature-flag/service/feature-acknowledgement.service';
import { ExtProfile, ExtUser, GettingStartedService } from '../../../getting-started/services/getting-started.service';

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
export class FeatureOptInComponent implements OnInit {

  @ViewChild(ListComponent) listComponent: ListComponent;

  featureLevel: string;
  listConfig: ListConfig;
  state: boolean;

  private items: FeatureLevel[];

  constructor(
    private readonly gettingStartedService: GettingStartedService,
    private readonly notifications: Notifications,
    private readonly userService: UserService,
    private readonly toggleService: FeatureTogglesService,
    private readonly toggleServiceAck: FeatureAcknowledgementService
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

  updateProfile(event: ListEvent): void {
    if (event.selectedItems.length === 0) {
      // Do not allow item deselection events - one item should always be selected. If a
      // deselection occurs, re-select the item and ignore the event.
      this.listComponent.selectItem(event.item, true);
      return;
    }
    this.featureLevel = event.item.name;
    const profile: ExtProfile = this.getTransientProfile();
    this.gettingStartedService.update(profile).pipe(first()).subscribe(
      (user: ExtUser): void => {
        this.userService.currentLoggedInUser = user;
        this.notifications.message({
          message: `Profile updated!`,
          type: NotificationType.SUCCESS
        });
      },
      () => {
        this.notifications.message({
          message: 'Failed to update profile',
          type: NotificationType.DANGER
        });
      });
  }

  private getTransientProfile(): ExtProfile {
    const profile: ExtProfile = this.gettingStartedService.createTransientProfile();
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
    this.toggleServiceAck.getToggle().pipe(first()).subscribe((state: boolean): void => {
      this.state = state;
    });
    this.featureLevel = (this.userService.currentLoggedInUser.attributes as ExtProfile).featureLevel;
    this.items = [
      {
        name: 'released',
        selected: this.featureLevel === 'released',
        title: 'Production-Only Features',
        description: 'Use the generally available version of CodeReady Toolchain.',
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

    this.toggleService.getAllFeaturesEnabledByLevel().pipe(first()).subscribe((features: Feature[]): void => {
      const featurePerLevel = this.featureByLevel(features);
      for (const item of this.items) {
        item.features = featurePerLevel[item.name];
      }
    });
  }

  onChange(event: { previousValue: boolean, currentValue: boolean }): void {
    this.toggleServiceAck.setToggle(event.currentValue);
  }

  featureByLevel(features: {} | Feature[]): any {
    const released: Feature[] = [];
    const internal: Feature[] = [];
    const experimental: Feature[] = [];
    const beta: Feature[] = [];
    for (const feature of features as Feature[]) {
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

}
