/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ReportSummaryCardComponent } from './report-summary-card.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ReportSummaryCardComponent
    ],
    exports: [
        ReportSummaryCardComponent
    ]
})
export class ReportSummaryCardModule {}
