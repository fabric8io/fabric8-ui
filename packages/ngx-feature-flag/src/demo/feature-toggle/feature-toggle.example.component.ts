import {
  ChangeDetectorRef,
  Component,
  OnInit, ViewChild
} from '@angular/core';

import {FeatureTogglesService} from '../../app/service/feature-toggles.service';
import {FeatureToggleComponent} from '../../app/feature-wrapper/feature-toggle.component';

@Component({
  selector: 'feature-toggle-example',
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
export class FeatureToggleExampleComponent implements OnInit {
  // we need a reference to refresh the component depending on mock values, on this demo page.
  // not needed usually
  @ViewChild(FeatureToggleComponent) toggleComponent: FeatureToggleComponent;
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

  refresh(updatedField: string) {
    if ((this.featureToggleService as any).featureFlagName === undefined) {
      return;
    }
    if (this.featureFlagEnablementLevel !== 'internal' &&
      this.featureFlagEnablementLevel !== 'experimental' &&
      this.featureFlagEnablementLevel !== 'beta' &&
      this.featureFlagEnablementLevel !== 'released') {
      this.featureFlagEnablementLevel = (this.featureToggleService as any).featureFlagEnablementLevel; // keep previous valid version
    }
    if (this.userLevel !== 'internal' &&
      this.userLevel !== 'experimental' &&
      this.userLevel !== 'beta' &&
      this.userLevel !== 'released') {
      this.userLevel = (this.featureToggleService as any).userLevel; // keep previous valid version
    }
    (this.featureToggleService as any).featureFlagName = this.featureFlagName;
    (this.featureToggleService as any).featureFlagEnable = this.featureFlagEnable;
    (this.featureToggleService as any).featureFlagEnablementLevel = this.featureFlagEnablementLevel;
    (this.featureToggleService as any).userLevel = this.userLevel;
    this.cd.detectChanges();
    this.toggleComponent.ngOnInit();
  }
}
