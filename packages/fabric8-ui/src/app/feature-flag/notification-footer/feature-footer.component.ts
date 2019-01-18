import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import { FeatureFlagConfig } from 'ngx-feature-flag';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'f8-feature-footer',
  templateUrl: './feature-footer.component.html',
  styleUrls: ['./feature-footer.component.less'],
  host: {
    '(document:click)': 'onClick($event)',
  },
})
export class FeatureFooterComponent implements OnInit, OnDestroy, OnChanges {
  @Input() featurePageConfig: FeatureFlagConfig;
  @Input() show: boolean;
  @ViewChild(TooltipDirective) tooltip: TooltipDirective;

  private userSubscription: Subscription;
  userLevel: string = 'released';
  noFeaturesInBeta: boolean = true;
  noFeaturesInExperimental: boolean = true;
  noFeaturesInInternal: boolean = true;

  betaFeatureText = '';
  experimentalFeatureText = '';
  internalFeatureText = '';

  constructor(private _eref: ElementRef) {}

  ngOnInit() {}

  onClick(event: any) {
    // Dismiss the tooltip when clicking outside the icon component
    if (!this._eref.nativeElement.contains(event.target) && this.tooltip) {
      this.tooltip.hide();
    }
  }

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
    if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.beta.length === 1
    ) {
      this.betaFeatureText = `is 1 beta feature`;
    } else if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.beta.length > 1
    ) {
      this.betaFeatureText = `are ${
        this.featurePageConfig.featuresPerLevel.beta.length
      } beta features`;
    }
    if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.experimental.length === 1
    ) {
      this.experimentalFeatureText = `is 1 experimental feature`;
    } else if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.experimental.length > 1
    ) {
      this.experimentalFeatureText = `are ${
        this.featurePageConfig.featuresPerLevel.experimental.length
      } experimental features`;
    }
    if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.internal.length === 1
    ) {
      this.internalFeatureText = `is 1 internal feature`;
    } else if (
      this.featurePageConfig.featuresPerLevel &&
      this.featurePageConfig.featuresPerLevel.internal.length > 1
    ) {
      this.internalFeatureText = `are ${
        this.featurePageConfig.featuresPerLevel.internal.length
      } internal features`;
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
        return (
          this.featurePageConfig.featuresPerLevel &&
          this.featurePageConfig.featuresPerLevel.beta &&
          this.featurePageConfig.featuresPerLevel.beta.length > 0
        );
      }
      case 'experimental': {
        return (
          (this.featurePageConfig.featuresPerLevel &&
            this.featurePageConfig.featuresPerLevel.experimental &&
            this.featurePageConfig.featuresPerLevel.experimental.length > 0) ||
          (this.featurePageConfig.featuresPerLevel &&
            this.featurePageConfig.featuresPerLevel.beta &&
            this.featurePageConfig.featuresPerLevel.beta.length > 0)
        );
      }
      case 'internal': {
        return (
          (this.featurePageConfig.featuresPerLevel &&
            this.featurePageConfig.featuresPerLevel.beta &&
            this.featurePageConfig.featuresPerLevel.beta.length > 0) ||
          (this.featurePageConfig.featuresPerLevel &&
            this.featurePageConfig.featuresPerLevel.experimental &&
            this.featurePageConfig.featuresPerLevel.experimental.length > 0) ||
          (this.featurePageConfig.featuresPerLevel &&
            this.featurePageConfig.featuresPerLevel.internal &&
            this.featurePageConfig.featuresPerLevel.internal.length > 0)
        );
      }
      default: {
        return true;
      }
    }
  }
}
