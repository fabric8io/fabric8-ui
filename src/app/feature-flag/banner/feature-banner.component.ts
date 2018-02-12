import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { FeatureAcknowledgementService } from '../service/feature-acknowledgement.service';

@Component({
  selector: 'f8-feature-banner',
  templateUrl: './feature-banner.component.html',
  styleUrls: ['./feature-banner.component.less']
})
export class FeatureBannerComponent implements OnInit, OnChanges, OnDestroy {

  @Input() featureName: string;
  @Input() level: string;

  public hideBanner: boolean;
  public profileLink: string;
  private userSubscription: Subscription;

  constructor(public router: Router,
              private authService: AuthenticationService,
              private featureAcknowledgementService: FeatureAcknowledgementService,
              private userService: UserService) {

    if (authService.isLoggedIn()) {
      this.userSubscription = userService.loggedInUser.subscribe(val => {
        if (val.id) {
          this.profileLink = '/' + val.attributes.username + '/_update';
        }
      });
    } else {
      this.profileLink = '/_home';
    }
  }

  ngOnInit() {
    this.hideBanner = false;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['featureName']) {
      if (this.featureName !== undefined) {
        this.hideBanner = this.featureAcknowledgementService.getAcknowledgement(this.featureName);
      }
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  acknowledgeWarning() {
    this.hideBanner = true;
    this.featureAcknowledgementService.setAcknowledgement(this.featureName, true);
  }
}
