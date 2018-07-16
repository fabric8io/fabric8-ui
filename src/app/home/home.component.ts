import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Subscription } from 'rxjs';

import { User, UserService } from 'ngx-login-client';

import { BrandInformation } from '../models/brand-information';
import { Fabric8UIConfig } from '../shared/config/fabric8-ui-config';

// use url-loader for images
import { FeatureTogglesService } from 'ngx-feature-flag';
import fabric8Logo from '../../assets/images/fabric8_logo.png';
import openshiftLogo from '../../assets/images/OpenShift-io_logo.png';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit, OnDestroy {

  brandInformation: BrandInformation;
  loggedInUser: User;
  private _loggedInUserSubscription: Subscription;

  constructor(
    private featureTogglesService: FeatureTogglesService,
    private userService: UserService,
    private fabric8UIConfig: Fabric8UIConfig
  ) { }

  ngOnInit() {
    this._loggedInUserSubscription = this.userService.loggedInUser.subscribe(val => this.loggedInUser = val);
    this.brandInformation = new BrandInformation();
    if (this.fabric8UIConfig.branding && this.fabric8UIConfig.branding === 'fabric8') {
      this.brandInformation.logo = fabric8Logo;
      // replace background image with fabric8 background once available
      this.brandInformation.backgroundClass = 'home-fabric8-background-image';
      this.brandInformation.description = 'A free, end-to-end, cloud-native development experience.';
      this.brandInformation.name = 'fabric8.io';
      this.brandInformation.moreInfoLink = 'https://fabric8.io/';
    } else {
      // default openshift.io branding
      this.brandInformation.logo = openshiftLogo;
      this.brandInformation.backgroundClass = 'home-header-background-image';
      this.brandInformation.description = 'A free, end-to-end, cloud-native development experience.';
      this.brandInformation.name = 'OpenShift.io';
      this.brandInformation.moreInfoLink = 'https://openshift.io/features.html';
    }
  }

  ngOnDestroy() {
    this._loggedInUserSubscription.unsubscribe();
  }
}
