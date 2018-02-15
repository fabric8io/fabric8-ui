/** Vendor imports Go HERE */
import { Component, Input } from '@angular/core';
/** Vendor imports Go HERE */

import { MReportSummaryContent } from '../../../models/ui.model';

@Component({
    selector: 'analytics-summary-content',
    styleUrls: ['./report-summary-content.component.less'],
    templateUrl: './report-summary-content.component.html'
})
export class ReportSummaryContentComponent {
    @Input() content: MReportSummaryContent;
    @Input() cardType: string;
}
