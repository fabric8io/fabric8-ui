/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ReportSummaryTitleComponent } from './report-summary-title/report-summary-title.component';
import { ReportSummaryDescriptionComponent } from './report-summary-description/report-summary-description.component';
import { ReportSummaryContentModule } from './report-summary-content/report-summary-content.module';

import { ReportSummaryCardComponent } from './report-summary-card.component';

const dependencies = [
    ReportSummaryTitleComponent,
    ReportSummaryDescriptionComponent
];

const imports = [
    ReportSummaryContentModule
];

@NgModule({
    imports: [
        CommonModule,
        ...imports
    ],
    declarations: [
        ...dependencies,
        ReportSummaryCardComponent
    ],
    exports: [
        ReportSummaryCardComponent
    ]
})
export class ReportSummaryCardModule {}
