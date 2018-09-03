/** Vendor imports Go HERE */
import { Component, Input } from '@angular/core';
/** Vendor imports Go HERE */

import { MReportSummaryInfoEntry } from '../../../../models/ui.model';

@Component({
    selector: 'ana-summary-info',
    styleUrls: ['./report-info-entries.component.less'],
    templateUrl: './report-info-entries.component.html'
})
export class ReportSummaryInfoEntriesComponent {
    @Input() entry: MReportSummaryInfoEntry;
}
