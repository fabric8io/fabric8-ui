/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ReportSummaryCardModule } from './report-summary-card/report-summary-card.module';
import { ReportSummaryComponent } from './report-summary.component';

@NgModule({
    imports: [
        CommonModule,
        ReportSummaryCardModule
    ],
    declarations: [
        ReportSummaryComponent
    ],
    exports: [
        ReportSummaryComponent
    ]
})
export class ReportSummaryModule {}
