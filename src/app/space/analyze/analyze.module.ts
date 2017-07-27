import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { AnalyzeComponent } from './analyze.component';
import { AnalyzeRoutingModule } from './analyze-routing.module';

import { AnalyzeOverviewModule } from './analyze-overview/analyze-overview.module';


@NgModule({
  imports: [AnalyzeOverviewModule,
            AnalyzeRoutingModule,
            CommonModule],
  declarations: [AnalyzeComponent]
})
export class AnalyzeModule {
  constructor(http: Http) { }
}
