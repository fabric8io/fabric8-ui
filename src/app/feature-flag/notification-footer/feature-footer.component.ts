import {
  Component, Input, OnChanges,
  OnDestroy,
  OnInit, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/operators/map';
import { FeatureFlagConfig } from '../../models/feature-flag-config';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-feature-footer',
  templateUrl: './feature-footer.component.html',
  styleUrls: ['./feature-footer.component.less']
})
export class FeatureFooterComponent implements OnInit, OnDestroy, OnChanges {

  @Input() featurePageConfig: FeatureFlagConfig;
  private userSubscription: Subscription;
  userLevel: string = 'released';
  noFeaturesInBeta: boolean = true;
  noFeaturesInExperimental: boolean = true;
  noFeaturesInInternal: boolean = true;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.featurePageConfig) {
      this.userLevel = this.featurePageConfig['user-level'] || 'released';
      if (this.featurePageConfig.featuresPerLevel
        && this.featurePageConfig.featuresPerLevel.beta
        && this.featurePageConfig.featuresPerLevel.beta.length > 0) {
        this.noFeaturesInBeta = false;
      }
      if (this.featurePageConfig.featuresPerLevel
        && this.featurePageConfig.featuresPerLevel.experimental
        && this.featurePageConfig.featuresPerLevel.experimental.length > 0) {
        this.noFeaturesInExperimental = false;
      }
      if (this.featurePageConfig.featuresPerLevel
        && this.featurePageConfig.featuresPerLevel.internal
        && this.featurePageConfig.featuresPerLevel.internal.length > 0) {
        this.noFeaturesInInternal = false;
      }
    } else {
      this.userLevel = 'released';
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

}
