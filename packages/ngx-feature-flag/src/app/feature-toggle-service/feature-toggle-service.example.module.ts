import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { FeatureFlagModule } from '../../../projects/ngx-feature-flag/src/lib/feature-flag.module';
import { FeatureTogglesService } from '../../../projects/ngx-feature-flag/src/lib/service/feature-toggles.service';
import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureToggleServiceExampleComponent } from './feature-toggle-service.example.component';


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
