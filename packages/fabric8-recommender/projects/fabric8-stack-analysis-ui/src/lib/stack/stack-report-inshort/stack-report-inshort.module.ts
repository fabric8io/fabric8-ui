import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabsModule } from 'ngx-bootstrap';
import { ChartModule } from '../utils/chart/chart.module';
import { StackDetailsModule } from '../stack-details/stack-details.module';
import { StackReportInShortComponent } from './stack-report-inshort.component';
import { ReportSummaryModule } from '../report-summary/report-summary.module';
import { CommonService } from '../utils/common.service';
import { StackAnalysesService } from '../stack-analyses.service';

@NgModule({
    imports: [
        CommonModule,
        ChartModule,
        StackDetailsModule,
        TabsModule.forRoot(),
        ReportSummaryModule
    ],
    declarations: [StackReportInShortComponent],
    exports: [StackReportInShortComponent],
    providers: [ CommonService, StackAnalysesService ]
})

export class StackReportInShortModule {}
