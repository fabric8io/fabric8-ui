import {
  Component, Input, OnChanges,
  OnDestroy,
  OnInit, ViewEncapsulation
} from '@angular/core';
import { Subscription } from 'rxjs';
import 'rxjs/operators/map';
import { FeatureFlagConfig } from '../../models/feature-flag-config';
import { Feature } from '../service/feature-toggles.service';

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

  betaFeatureText = '';
  experimentalFeatureText = '';
  internalFeatureText = '';

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.featurePageConfig) {
      // re-init the boolean values
      this.noFeaturesInInternal = true;
      this.noFeaturesInBeta = true;
      this.noFeaturesInExperimental = true;

      this.descriptionPerLevel();

      if (this.isNotEmpty('beta')) {
        this.noFeaturesInBeta = false;
      }
      if (this.isNotEmpty('experimental')) {
        this.noFeaturesInExperimental = false;
      }
      if (this.isNotEmpty('internal')) {
        this.noFeaturesInInternal = false;
      }
    } else {
      this.userLevel = 'released';
    }
  }

  descriptionPerLevel() {
    this.betaFeatureText = '';
    this.experimentalFeatureText = '';
    this.internalFeatureText = '';
    this.userLevel = this.featurePageConfig['user-level'] || 'released';
    if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.beta.length === 1) {
      this.betaFeatureText = `is 1 beta feature`;
    } else if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.beta.length > 1) {
      this.betaFeatureText = `are ${this.featurePageConfig.featuresPerLevel.beta.length} beta features`;
    }
    if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.experimental.length === 1) {
      this.experimentalFeatureText = `is 1 experimental feature`;
    } else if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.experimental.length > 1) {
      this.experimentalFeatureText = `are ${this.featurePageConfig.featuresPerLevel.experimental.length} experimental features`;
    }
    if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.internal.length === 1) {
      this.internalFeatureText = `is 1 internal feature`;
    } else if (this.featurePageConfig.featuresPerLevel && this.featurePageConfig.featuresPerLevel.internal.length > 1) {
      this.internalFeatureText = `are ${this.featurePageConfig.featuresPerLevel.internal.length} internal features`;
    }
  }

  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  isNotEmpty(level: string): boolean {
    switch (level) {
      case 'beta': {
        return this.featurePageConfig.featuresPerLevel
          && this.featurePageConfig.featuresPerLevel.beta
          && this.featurePageConfig.featuresPerLevel.beta.length > 0;
      }
      case 'experimental': {
        return (this.featurePageConfig.featuresPerLevel
          && this.featurePageConfig.featuresPerLevel.experimental
          && this.featurePageConfig.featuresPerLevel.experimental.length > 0)
          || (this.featurePageConfig.featuresPerLevel
            && this.featurePageConfig.featuresPerLevel.beta
            && this.featurePageConfig.featuresPerLevel.beta.length > 0);
      }
      case 'internal': {
        return (this.featurePageConfig.featuresPerLevel
          && this.featurePageConfig.featuresPerLevel.beta
          && this.featurePageConfig.featuresPerLevel.beta.length > 0)
          || (this.featurePageConfig.featuresPerLevel
            && this.featurePageConfig.featuresPerLevel.experimental
            && this.featurePageConfig.featuresPerLevel.experimental.length > 0)
          || (this.featurePageConfig.featuresPerLevel
            && this.featurePageConfig.featuresPerLevel.internal
            && this.featurePageConfig.featuresPerLevel.internal.length > 0);
      }
      default: {
        return true;
      }
    }
  }
}
