import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Feature, FeatureTogglesService } from '../service/feature-toggles.service';

@Component({
  selector: 'f8-feature-toggle',
  template: `<ng-content *ngIf="isEnabled"></ng-content>`
})
export class FeatureToggleComponent implements OnInit {
  @Input() featureName: string;
  isEnabled = false;

  constructor(private featureService: FeatureTogglesService) {}

  ngOnInit() {
    if (!this.featureName) {
      throw new Error('Attribute `featureName` should not be null or empty');
    }

    this.featureService.getFeature(this.featureName).subscribe((f: Feature) => {
        this.isEnabled = f.attributes.enabled && f.attributes['user-enabled'];
      },
      err => {
        this.isEnabled = false;
        console.log('This feature is not accessible in fabric8-toggles-service' + err);
      });
  }

}
