import {
  ChangeDetectorRef,
  Component, OnChanges,
  OnInit
} from '@angular/core';

import {FeatureTogglesService} from '../../app/service/feature-toggles.service';

@Component({
  selector: 'sample-example',
  styles: [`
    .sample-form .form-horizontal .form-group {
      margin-left: 0px;
    }
    .padding-top-15 {
      padding-top: 15px;
    }
    .padding-bottom-15 {
      padding-bottom: 15px;
    }
  `],
  templateUrl: './feature-toggle.example.component.html'
})
export class FeatureToggleExampleComponent implements OnInit, OnChanges {
  featureFlagName: string = 'Test';
  featureFlagEnable: boolean = true;
  featureFlagEnablementLevel: string = 'beta';
  userLevel: string = 'internal';

  constructor(private featureToggleService: FeatureTogglesService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    (this.featureToggleService as any).featureFlagName = this.featureFlagName;
    (this.featureToggleService as any).featureFlagEnable = this.featureFlagEnable;
    (this.featureToggleService as any).featureFlagEnablementLevel = this.featureFlagEnablementLevel;
    (this.featureToggleService as any).userLevel = this.userLevel;
  }

  ngOnChanges(): void {
    (this.featureToggleService as any).featureFlagName = this.featureFlagName;
    (this.featureToggleService as any).featureFlagEnable = this.featureFlagEnable;
    (this.featureToggleService as any).featureFlagEnablementLevel = this.featureFlagEnablementLevel;
    (this.featureToggleService as any).userLevel = this.userLevel;
  }

  refresh(updatedField: string) {
    this.cd.detectChanges();
    //this.field = updatedField.replace(new RegExp("[^\\d]", "g"), ""); // remove everything except numbers
  }
}
