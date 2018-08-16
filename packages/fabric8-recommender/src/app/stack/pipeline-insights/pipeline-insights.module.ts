import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';


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
  providers: [ GlobalConstants ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PipelineInsightsModule {
  constructor() {}
}
