/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges,
    AfterContentInit
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    MReportSummaryCard,
    MReportSummaryContent,
    MReportSummaryInfoEntry,
    MReportSummaryTitle
} from '../../models/ui.model';
import { SaveState } from '../../utils/SaveState';

@Component({
    selector: 'analytics-summary-card',
    styleUrls: ['./report-summary-card.component.less'],
    templateUrl: './report-summary-card.component.html'
})
export class ReportSummaryCardComponent implements AfterContentInit {

    @Input() card: MReportSummaryCard;

    public reportSummaryContent: MReportSummaryContent;
    public reportSummaryTitle: MReportSummaryTitle;
    public reportSummaryDescription: string;

    ngOnInit() {
        this.paintView();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['card'];
        if (summary) {
            this.card = <MReportSummaryCard> summary.currentValue;
            this.repaintView();
        }
    }

    ngAfterContentInit() {
        SaveState.ELEMENTS[0].click();
    }

    private updateCard(): void {
        if (this.card) {
            this.reportSummaryTitle = this.card.reportSummaryTitle;
            this.reportSummaryDescription = this.card.reportSummaryDescription;
            this.reportSummaryContent = this.card.reportSummaryContent;
        }
    }

    private paintView(): void {
        this.updateCard();
    }

    private repaintView(): void {
        this.paintView();
    }
}
