import {
  ChangeDetectorRef,
  Component,
  OnInit, ViewChild
} from '@angular/core';

import { FeatureContainerComponent } from '../../../projects/ngx-feature-flag/src/lib/feature-loader/feature-loader.component';
import { FeatureTogglesService } from '../../../projects/ngx-feature-flag/src/lib/service/feature-toggles.service';


@Component({
  selector: 'app-feature-toggle-loader-example',
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
  templateUrl: './feature-toggle-loader.example.component.html'
})
export class FeatureToggleLoaderExampleComponent implements OnInit {
  // we need a reference to refresh the component depending on mock values, on this demo page.
  // not needed usually
  @ViewChild(FeatureContainerComponent) toggleComponent: FeatureContainerComponent;
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
