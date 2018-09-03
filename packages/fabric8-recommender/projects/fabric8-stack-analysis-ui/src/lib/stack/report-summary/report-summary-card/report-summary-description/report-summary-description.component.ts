/** Vendor imports Go HERE */
import { Component, Input } from '@angular/core';
/** Vendor imports Go HERE */

@Component({
    selector: 'analytics-summary-description',
    styleUrls: ['./report-summary-description.component.less'],
    templateUrl: './report-summary-description.component.html'
})
export class ReportSummaryDescriptionComponent {
    @Input() description: string;
}
