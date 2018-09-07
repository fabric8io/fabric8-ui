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
    @Input() isFromShortReport: string;

    public reportSummaryContent: MReportSummaryContent;
    public reportSummaryTitle: MReportSummaryTitle;
    public reportSummaryDescription: string;
    public identifier: string;

    ngOnInit() {
        this.paintView();
    }

    ngOnChanges(changes: SimpleChanges) {
        const summary: any = changes['card'];
        if (summary) {
            this.card = <MReportSummaryCard> summary.currentValue;
            this.repaintView();
        }
    }

    ngAfterContentInit() {
        if (this.isFromShortReport !== 'true' && SaveState.ELEMENTS[0]) {
            SaveState.ELEMENTS[0].click();
        }
    }

    private updateCard(): void {
        if (this.card) {
            this.reportSummaryTitle = this.card.reportSummaryTitle;
            if (this.isFromShortReport === 'true') {
                this.reportSummaryDescription = this.card.reportSummaryDescriptionShort;
            } else {
                this.reportSummaryDescription = this.card.reportSummaryDescription;
            }
            this.reportSummaryContent = this.card.reportSummaryContent;
            this.identifier = this.card.identifier;
        }
    }

    private paintView(): void {
        this.updateCard();
    }

    private repaintView(): void {
        this.paintView();
    }
}
