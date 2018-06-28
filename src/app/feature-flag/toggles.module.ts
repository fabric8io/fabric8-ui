import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureFlagModule } from 'ngx-feature-flag';
import { TogglesRoutingModule } from './toggles-routing.module';


@NgModule({
  imports: [
    CommonModule,
    FeatureFlagModule,
    TogglesRoutingModule
  ]
})
export class TogglesModule {
  constructor() {}
}
