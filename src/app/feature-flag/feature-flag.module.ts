import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FeatureFlagMapping } from '../feature-flag.mapping';
import { FeatureContainerComponent } from './feature-loader/feature-loader.component';
import { FeatureToggleComponent } from './feature-wrapper/feature-toggle.component';

@NgModule({
  imports: [CommonModule],
  declarations: [FeatureToggleComponent, FeatureContainerComponent],
  exports: [FeatureToggleComponent, FeatureContainerComponent],
  providers: [FeatureFlagMapping]

})
export class FeatureFlagModule { }
