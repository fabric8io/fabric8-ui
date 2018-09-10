import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PipelineInsightsService } from './pipeline-insights.service';
import { GlobalConstants } from '../constants/constants.service';
import { PipelineInsightsComponent } from './pipeline-insights.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  declarations: [
    PipelineInsightsComponent
  ],
  exports: [
    PipelineInsightsComponent
  ],
  providers: [ GlobalConstants, PipelineInsightsService ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PipelineInsightsModule {
  constructor() {}
}
