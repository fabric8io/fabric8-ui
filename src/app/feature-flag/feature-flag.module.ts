import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureToggleComponent } from './feature-wrapper/feature-toggle.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FeatureToggleComponent],
  exports: [FeatureToggleComponent]
})
export class FeatureFlagModule { }
