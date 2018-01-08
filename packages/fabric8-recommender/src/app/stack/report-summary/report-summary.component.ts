/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnChanges,
    OnInit,
    SimpleChanges
} from '@angular/core';
/** Vendor imports Go HERE */

import {
    ResultInformationModel,
    SecurityInformationModel,
    RecommendationsModel,
    ComponentInformationModel,
    StackLicenseAnalysisModel,
    UserStackInfoModel
} from '../models/stack-report.model';

import {
    MReportSummaryCard,
    MReportSummaryContent,
    MReportSummaryInfoEntry,
    MReportSummaryTitle
} from '../models/ui.model';
import { ReportSummaryUtils } from '../utils/report-summary-utils';

@Component({
    selector: 'analytics-report-summary',
    styleUrls: ['./report-summary.component.less'],
    templateUrl: './report-summary.component.html'
})
export class ReportSummaryComponent implements OnInit, OnChanges {
    @Input() report: ResultInformationModel;

    public reportSummaryCards: Array<MReportSummaryCard> = [];

    public reportSummaryContent: MReportSummaryContent;
    public reportSummaryTitle: MReportSummaryTitle;
    public reportSummaryDescription: string;
    public notification = null;
    private reportSummaryUtils = new ReportSummaryUtils();

    constructor() {
        this.notification = this.reportSummaryUtils.notification;
    }

    ngOnInit() {
        this.paintView();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['report'];
        if (summary) {
            this.report = <ResultInformationModel> summary.currentValue;
            this.repaintView();
        }
    }

    private getSecurityReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getSecurityReportCard(this.report.user_stack_info);
    }

    private getInsightsReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getInsightsReportCard(this.report.recommendation);
    }

    private getLicensesReportCard(): MReportSummaryCard {
        return this.reportSummaryUtils.getLicensesReportCard(this.report.user_stack_info);
    }

    private getComponentDetailsReportCard(): MReportSummaryCard {
        let componentDetailsCard: MReportSummaryCard = this.reportSummaryUtils.newCardInstance();

        componentDetailsCard.reportSummaryTitle.titleIcon = 'fa fa-cube';
        componentDetailsCard.reportSummaryTitle.titleText = 'Component Details';
        componentDetailsCard.reportSummaryDescription = 'This shows the Component Details Description and it can go to more than a line';
        componentDetailsCard.reportSummaryContent.infoEntries = [];

        if (this.report.user_stack_info
            && this.report.user_stack_info) {
            let userStackInfo: UserStackInfoModel = this.report.user_stack_info;

            let analyzedCount: number, totalCount: number, unknownCount: number;
            analyzedCount = userStackInfo.analyzed_dependencies ? userStackInfo.analyzed_dependencies.length : 0;
            totalCount = userStackInfo.dependencies ? userStackInfo.dependencies.length : 0;
            unknownCount = userStackInfo.unknown_dependencies ? userStackInfo.unknown_dependencies.length : totalCount - analyzedCount;

            let totalEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            totalEntry.infoText = 'Total Components';
            totalEntry.infoValue = totalCount;

            let analyzedEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            analyzedEntry.infoText = 'Analyzed Components';
            analyzedEntry.infoValue = analyzedCount;

            let unknownEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            unknownEntry.infoText = 'Unknown Components';
            unknownEntry.infoValue = unknownCount;

            componentDetailsCard.reportSummaryContent.infoEntries.push(totalEntry);
            componentDetailsCard.reportSummaryContent.infoEntries.push(analyzedEntry);
            componentDetailsCard.reportSummaryContent.infoEntries.push(unknownEntry);
        } else {
            // Handle no user components scenario
        }

        return componentDetailsCard;
    }

    private updateCards(): void {
        let cards: Array<MReportSummaryCard> = [];
        if (this.report) {
            cards[0] = this.getSecurityReportCard();
            cards[1] = this.getInsightsReportCard();
            cards[2] = this.getLicensesReportCard();
            cards[3] = this.getComponentDetailsReportCard();
        }
        this.reportSummaryCards = cards;
    }

    private paintView(): void {
        this.updateCards();
    }

    private repaintView(): void {
        this.paintView();
    }
}
