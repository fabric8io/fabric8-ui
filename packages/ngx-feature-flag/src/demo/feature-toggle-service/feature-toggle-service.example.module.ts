import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureFlagModule } from '../../app/feature-flag.module';
import { FeatureToggleServiceExampleComponent } from './feature-toggle-service.example.component';
import { FeatureTogglesService } from '../../app/service/feature-toggles.service';


@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleServiceExampleComponent],
  exports: [FeatureToggleServiceExampleComponent],
  providers: [TabsetConfig, FeatureTogglesService]
})
export class FeatureToggleServiceExampleModule {
  constructor() {}
}
