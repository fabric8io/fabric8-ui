import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FeatureFlagModule } from 'ngx-feature-flag';

import { AnalyzeRoutingModule } from './analyze-routing.module';
import { AnalyzeComponent } from './analyze.component';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module';


@NgModule({
  imports: [AnalyzeOverviewModule,
            AnalyzeRoutingModule,
            CommonModule,
            FeatureFlagModule],
  declarations: [AnalyzeComponent]
})
export class AnalyzeModule {
  constructor() { }
}
