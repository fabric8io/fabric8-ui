import { Component, Input, OnInit, Type } from '@angular/core';
import { FeatureFlagMapping } from '../feature-flag.mapping';
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
    this.featureService.getFeatures([this.featureName]).subscribe(feats => {
      if (feats && feats.length > 0) {
        if (this.featureName === feats[0].id) {
          if (feats[0].attributes.enabled && feats[0].attributes['user-enabled']) {
            this.featureComponent = this.featureFlagMapping.convertFeatureNameToComponent(feats[0].id);
          } else {
            this.featureComponent = null;
          }
        }
      }
    });
  }
}
