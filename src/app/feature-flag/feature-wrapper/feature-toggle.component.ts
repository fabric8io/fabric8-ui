import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';

@Component({
  selector: 'f8-feature-toggle',
  template: `<ng-content *ngIf="isEnabled" select="[user-level]"></ng-content><ng-content *ngIf="!isEnabled" select="[default-level]"></ng-content>`
})
export class FeatureToggleComponent implements OnInit {
  @Input() featureName: string;
  @Input() restricted = 'prod';
  isEnabled = false;
  currentUrl = window.location.href;

  constructor(private featureService: FeatureTogglesService) {}

  ngOnInit() {
    if (!this.featureName) {
      throw new Error('Attribute `featureName` should not be null or empty');
    }

    this.featureService.getFeature(this.featureName).subscribe((f: Feature) => {
        let localHost = this.currentUrl.indexOf('localhost') > -1;
        if (this.restricted.toLowerCase() === 'dev') {
          this.isEnabled = f.attributes.enabled && f.attributes['user-enabled'] && localHost;
        } else {
          this.isEnabled = f.attributes.enabled && f.attributes['user-enabled'];
        }
      },
      err => {
        this.isEnabled = false;
        console.log('This feature is not accessible in fabric8-toggles-service' + err);
      });
  }

}
