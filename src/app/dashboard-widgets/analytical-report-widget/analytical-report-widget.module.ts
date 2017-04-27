import { StackDetailsModule } from 'fabric8-stack-analysis-ui';
import { AnalyticalReportWidgetComponent } from './analytical-report-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {StackAnalysisPipe} from './stack-analysis-pipe.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, StackDetailsModule],
  declarations: [AnalyticalReportWidgetComponent, StackAnalysisPipe],
  exports: [AnalyticalReportWidgetComponent, StackAnalysisPipe]
})
export class AnalyticalReportWidgetModule { }
