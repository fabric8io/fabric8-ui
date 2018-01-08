import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';

import { Notification, Notifications, NotificationType } from 'ngx-base';
import 'rxjs/operators/map';

import { GettingStartedService } from '../getting-started/services/getting-started.service';

@Component({
  selector: 'f8-exp-feature-page',
  templateUrl: './exp-feature-page.component.html'
})
export class ExpFeaturePageComponent implements OnInit, OnDestroy {

  enableFeatures: boolean;

  @Output() onExperimentalFeaturesEnabled = new EventEmitter<boolean>();

  constructor(private gettingStartedService: GettingStartedService,
              private notifications: Notifications) {
  }

  ngOnInit() {
    this.enableFeatures = false;
  }

  ngOnDestroy() {
  }

  activateExperimentalFeatures() {
    let profile = this.gettingStartedService.createTransientProfile();

    if (!profile.contextInformation) {
      profile.contextInformation = {};
    }

    if (!profile.contextInformation.experimentalFeatures) {
      profile.contextInformation.experimentalFeatures = {};
    }
    profile.contextInformation.experimentalFeatures['enabled'] = true;

    this.gettingStartedService.update(profile).subscribe(() => {
      // reset boolean in case they come back in here later
      this.enableFeatures = false;
      this.onExperimentalFeaturesEnabled.emit(true);
      this.notifications.message({
        message: `Experimental features enabled!`,
        type: NotificationType.SUCCESS
      } as Notification);
    }, error => {
      this.notifications.message({
        message: `Failed to update profile"`,
        type: NotificationType.DANGER
      } as Notification);
    });
  }
}
