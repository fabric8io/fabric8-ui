import {
  Component,
  OnDestroy,
  OnInit,
  EventEmitter,
  Output
} from '@angular/core';
import { TweenMax, TimelineMax, Power2 } from 'gsap';
import 'rxjs/add/operator/map';
import { Notifications, Notification, NotificationType } from 'ngx-base';
import { GettingStartedService } from '../getting-started/services/getting-started.service';

@Component({
  selector: 'f8-exp-feature-page',
  templateUrl: './exp-feature-page.component.html',
  styleUrls: ['./exp-feature-page.component.less']
})
export class ExpFeaturePageComponent implements OnInit, OnDestroy {

  enableFeatures: boolean;

  @Output() onExperimentalFeaturesEnabled = new EventEmitter<boolean>();

  constructor(private gettingStartedService: GettingStartedService,
              private notifications: Notifications) {
  }

  ngOnInit() {
    this.enableFeatures = false;

    TweenMax.set('svg', {
      visibility: 'visible'
    });

    let targetObject = document.getElementsByTagName('circle');
    let tl = new TimelineMax();
    tl.staggerTo(targetObject, 3, {
      attr: {
        cy: 200
      },
      ease:Power2.easeIn,
      repeat: -1
    }, 0.6)
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
    profile.contextInformation.experimentalFeatures["enabled"] = true;

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
