import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeatureFlagMapping } from '../feature-flag.mapping';
import { FeatureFlagRoutingModule } from './feature-flag-routing.module';
import { FeatureContainerComponent } from './feature-loader/feature-loader.component';
import { FeatureToggleComponent } from './feature-wrapper/feature-toggle.component';
import { FeatureFlagHomeComponent } from './home/feature-flag-home.component';
import { FeatureWarningPageComponent } from './warning-page/feature-warning-page.component';

@NgModule({
  imports: [CommonModule, RouterModule, FeatureFlagRoutingModule],
  declarations: [FeatureToggleComponent, FeatureContainerComponent, FeatureWarningPageComponent, FeatureFlagHomeComponent],
  exports: [FeatureToggleComponent, FeatureContainerComponent, FeatureWarningPageComponent, FeatureFlagHomeComponent],
  providers: [FeatureFlagMapping]

})
export class FeatureFlagModule { }
