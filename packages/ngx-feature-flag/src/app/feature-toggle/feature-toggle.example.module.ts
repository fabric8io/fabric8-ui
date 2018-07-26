import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { FeatureFlagModule } from '../../../projects/ngx-feature-flag/src/lib/feature-flag.module';
import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureToggleExampleComponent } from './feature-toggle.example.component';

@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleExampleComponent],
  exports: [FeatureToggleExampleComponent],
  providers: [TabsetConfig]
})
export class FeatureToggleExampleModule {
  constructor() {}
}
