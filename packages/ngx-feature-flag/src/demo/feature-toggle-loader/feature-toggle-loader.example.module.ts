import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureFlagModule } from '../../app/feature-flag.module';
import { FeatureToggleLoaderExampleComponent } from './feature-toggle-loader.example.component';

@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleLoaderExampleComponent],
  exports: [FeatureToggleLoaderExampleComponent],
  providers: [TabsetConfig]
})
export class FeatureToggleLoaderExampleModule {
  constructor() {}
}
