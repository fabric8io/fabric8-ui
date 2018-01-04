/** Vendor imports Go HERE */
import { Component, Input } from '@angular/core';
/** Vendor imports Go HERE */

import { MReportSummaryTitle } from '../../../models/ui.model';

@Component({
    selector: 'analytics-summary-title',
    styleUrls: ['./report-summary-title.component.less'],
    templateUrl: './report-summary-title.component.html'
})
export class ReportSummaryTitleComponent {
    @Input() title: MReportSummaryTitle;
}
