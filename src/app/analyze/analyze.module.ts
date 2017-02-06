import { NgModule, CUSTOM_ELEMENTS_SCHEMA }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeComponent }     from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module';

import {StackModule} from './stackreports/render-stack-details/module';

@NgModule({
  imports:      [ StackModule, AnalyzeOverviewModule, CommonModule, AnalyzeRoutingModule, HttpModule ],
  declarations: [ AnalyzeComponent ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AnalyzeModule {
  constructor(http: Http) {}
}
