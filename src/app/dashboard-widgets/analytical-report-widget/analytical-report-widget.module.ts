import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StackDetailsModule, StackReportInShortModule } from 'fabric8-stack-analysis-ui';

import { AnalyticalReportWidgetComponent } from './analytical-report-widget.component';
import { StackAnalysisPipe } from './stack-analysis-pipe.pipe';

@NgModule({
  imports: [CommonModule, FormsModule, StackDetailsModule, StackReportInShortModule],
  declarations: [AnalyticalReportWidgetComponent, StackAnalysisPipe],
  exports: [AnalyticalReportWidgetComponent, StackAnalysisPipe]
})
export class AnalyticalReportWidgetModule { }
