import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { TabsetConfig, TabsModule } from 'ngx-bootstrap/tabs';

import { DemoComponentsModule } from '../welcome/demo-components.module';
import { FeatureFlagModule } from '../../app/feature-flag.module';
import { FeatureToggleLoaderExampleComponent } from './feature-toggle-loader.example.component';
import { DynamicallyLoadedComponent } from './dynamically-loaded.component';


import { FeatureContainerComponent } from '../../app/feature-loader/feature-loader.component';
import { FeatureFlagMapping } from '../../app/feature-flag.mapping';
import { MyFeatureFlagMapping } from './feature-flag.mapping';

@NgModule({
  imports: [
    CommonModule,
    DemoComponentsModule,
    FormsModule,
    FeatureFlagModule,
    TabsModule.forRoot()
  ],
  declarations: [FeatureToggleLoaderExampleComponent, DynamicallyLoadedComponent],
  exports: [FeatureToggleLoaderExampleComponent, DynamicallyLoadedComponent],
  providers: [
    TabsetConfig,
    {provide: FeatureFlagMapping, useClass: MyFeatureFlagMapping}
    ],
  entryComponents: [DynamicallyLoadedComponent, FeatureContainerComponent]
})
export class FeatureToggleLoaderExampleModule {
  constructor() {}
}
