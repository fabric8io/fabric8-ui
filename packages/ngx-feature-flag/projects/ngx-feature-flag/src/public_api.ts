/*
 * Public API Surface of ngx-feature-flag
 */

export { FeatureWarningPageComponent } from './lib/warning-page/feature-warning-page.component';
export { FeatureFlagHomeComponent } from './lib/home/feature-flag-home.component';
export { FeatureContainerComponent } from './lib/feature-loader/feature-loader.component';
export { FeatureToggleComponent } from './lib/feature-wrapper/feature-toggle.component';

export { FeatureTogglesService, FABRIC8_FEATURE_TOGGLES_API_URL } from './lib/service/feature-toggles.service';

export { Feature } from './lib/models/feature';
export { FeatureFlagConfig } from './lib/models/feature-flag-config';

export { FeatureFlagModule } from './lib/feature-flag.module';

