/** Vendor imports Go HERE */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/** Vendor imports Go HERE */

import { ProgressMeterModule } from '../../../utils/progress-meter/progress-meter.module';

import { ReportSummaryInfoEntriesComponent } from './report-info-entries/report-info-entries.component';
import { ReportSummaryContentComponent } from './report-summary-content.component';

const dependencies = [
    ReportSummaryInfoEntriesComponent
];

const imports = [
    ProgressMeterModule
];

@NgModule({
    imports: [
        CommonModule,
        ...imports
    ],
    declarations: [
        ...dependencies,
        ReportSummaryContentComponent
    ],
    exports: [
        ReportSummaryContentComponent
    ]
})
export class ReportSummaryContentModule {}
