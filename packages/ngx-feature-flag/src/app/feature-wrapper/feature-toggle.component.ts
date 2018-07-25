import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { FeatureTogglesService } from '../service/feature-toggles.service';

@Component({
  selector: 'f8-feature-toggle',
  template: `<ng-content *ngIf="isEnabled" select="[user-level]"></ng-content><ng-content *ngIf="!isEnabled" select="[default-level]"></ng-content>`
})
export class FeatureToggleComponent implements OnInit {
  @Input() featureName: string;
  isEnabled = false;

  constructor(private featureService: FeatureTogglesService) {}

  ngOnInit() {
    if (!this.featureName) {
      throw new Error('Attribute `featureName` should not be null or empty');
    }

    this.featureService.isFeatureUserEnabled(this.featureName).subscribe((isEnabled: boolean) => {
      this.isEnabled = isEnabled;
    });
  }

}
