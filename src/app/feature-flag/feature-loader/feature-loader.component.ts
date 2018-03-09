import { Component, Input, OnInit, Type } from '@angular/core';
import { FeatureFlagMapping } from '../../feature-flag.mapping';
import { FeatureTogglesService } from '../service/feature-toggles.service';

@Component({
  selector: 'f8-feature-toggle-loader',
  template: `<ng-template *ngComponentOutlet="featureComponent"></ng-template>`
})
export class FeatureContainerComponent implements OnInit {
  @Input() featureName: string;
  featureComponent: Type<any>;

  constructor(private featureService: FeatureTogglesService, private featureFlagMapping: FeatureFlagMapping) {}

  ngOnInit() {
    this.featureService.getFeature(this.featureName).subscribe(feat => {
      console.log(`FeatureContainerComponent::Toggle ${feat.id} changed to ${feat.attributes.enabled}`);
      if (this.featureName === feat.id) {
        if (feat.attributes.enabled && feat.attributes['user-enabled']) {
          this.featureComponent = this.featureFlagMapping.convertFeatureNameToComponent(feat.id);
        } else {
          this.featureComponent = null;
        }
      }
    });
  }
}
