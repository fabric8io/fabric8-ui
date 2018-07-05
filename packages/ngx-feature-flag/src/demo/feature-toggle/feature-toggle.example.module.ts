import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureFlagModule } from '../../app/feature-flag.module';
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
