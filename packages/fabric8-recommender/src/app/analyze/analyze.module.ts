import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AnalyzeComponent } from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module';

import { StackDetailsModule } from './stack/stack-details/stack-details.module';


@NgModule({
  imports: [AnalyzeOverviewModule,
            AnalyzeRoutingModule,
            CommonModule,
            HttpModule,
            StackDetailsModule],
  declarations: [AnalyzeComponent]
})
export class AnalyzeModule {
  constructor(http: Http) { }
}
