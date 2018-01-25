/** Vendor imports Go HERE */
import {
    Component,
    Input,
    Output,
    EventEmitter,
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
    UserStackInfoModel,
    GithubModel,
    OutlierInformationModel
} from '../models/stack-report.model';

import {
    MReportSummaryCard,
    MReportSummaryContent,
    MReportSummaryInfoEntry,
    MReportSummaryTitle,
    MSecurityDetails,
    MSecurityIssue,
    MProgressMeter
} from '../models/ui.model';
import { ReportSummaryUtils } from '../utils/report-summary-utils';

@Component({
    selector: 'analytics-report-summary',
    styleUrls: ['./report-summary.component.less'],
    templateUrl: './report-summary.component.html'
})
export class ReportSummaryComponent implements OnInit, OnChanges {
    @Input() report: ResultInformationModel;
    @Output('onCardClick') onCardClick = new EventEmitter<any>();

    public reportSummaryCards: Array<MReportSummaryCard> = [];

    public reportSummaryContent: MReportSummaryContent;
    public reportSummaryTitle: MReportSummaryTitle;
    public reportSummaryDescription: string;
    public notification = null;
    private reportSummaryUtils = new ReportSummaryUtils();

    constructor() {
        this.notification = this.reportSummaryUtils.notification;
    }

    public cardTypes: any = {
        SECURITY: 'security',
        INSIGHTS: 'insights',
        LICENSES: 'licenses',
        COMP_DETAILS: 'compDetails'
    };

    public titleAndDescription: any = {
        [this.cardTypes.SECURITY]: {
            title: 'Components with security issues in your stack',
            description: 'OSIO Analytics identifies security issues in your stack. Click this card to see further details of the security tasks affecting your stack.'
        },
        [this.cardTypes.INSIGHTS]: {
            title: 'Insights on alternate or additional components that can augment your stack',
            description: 'OSIO Analytics identifies components that are rarely used in similar stacks, and suggests alternate and additional components that can enhance your stack. Click this card to see detailed suggestions on alternate and additional components.'
        },
        [this.cardTypes.LICENSES]: {
            title: 'License details of components in your stack',
            description: 'OSIO Analytics identifies the stack level license, the conflicting licenses, and the unknown licenses for your stack. Click this card to see detailed information on the conflicting and unknown licenses in your stack.'
        },
        [this.cardTypes.COMP_DETAILS]: {
            title: 'Component details of your manifest file',
            description: 'OSIO Analytics identifies the total number of components, analyzes them, and provides details on security, usage, and license issues in your components. It also lists components unknown to OSIO.'
        }
    };

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

    public handleSummaryClick(card: MReportSummaryCard): void {
        if (card) {
            let cardType: string = card.identifier || '';
            this.onCardClick.emit({
                cardType: cardType,
                report: this.report
            });
        }
    }

    private newCardInstance(): MReportSummaryCard {
        let newCard: MReportSummaryCard = new MReportSummaryCard();
        newCard.reportSummaryContent = new MReportSummaryContent();
        newCard.reportSummaryTitle = new MReportSummaryTitle();
        return newCard;
    }

    private getComponentSecurityInformation(component: ComponentInformationModel): MSecurityDetails {
        if (component) {
            let securityDetails: MSecurityDetails = new MSecurityDetails();
            let securityIssues: number = 0;
            let maxIssue: SecurityInformationModel = null,
            temp: SecurityInformationModel = null;
            if (component.security && component.security.length > 0) {
                let currSecurity: Array<SecurityInformationModel> = component.security;
                temp = currSecurity.reduce((a, b) => {
                    return parseFloat(a.CVSS) < parseFloat(b.CVSS) ? b : a;
                });
                if (temp) {
                    if (maxIssue === null || maxIssue.CVSS < temp.CVSS) {
                        maxIssue = temp;
                    }
                }
                securityIssues += currSecurity.length;
            }
            if (maxIssue) {
                securityDetails.highestIssue = new MSecurityIssue(
                    maxIssue.CVSS,
                    maxIssue.CVE
                );
                securityDetails.progressReport = new MProgressMeter(
                    '',
                    Number(maxIssue.CVSS),
                    Number(maxIssue.CVSS) >= 7 ? '#ff6162' : 'ORANGE',
                    '',
                    Number(maxIssue.CVSS) * 10
                );
            }
            securityDetails.totalIssues = securityIssues;
            return securityDetails;
        }
        return null;
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

        componentDetailsCard.identifier = this.cardTypes.COMP_DETAILS;
        componentDetailsCard.reportSummaryTitle.titleIcon = 'fa fa-cube';
        componentDetailsCard.reportSummaryTitle.titleText = 'Component Details';
        componentDetailsCard.reportSummaryDescription = this.titleAndDescription[this.cardTypes.COMP_DETAILS].description;
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
            cards[1] = this.getLicensesReportCard();
            cards[2] = this.getInsightsReportCard();
            cards[3] = this.getComponentDetailsReportCard();
        }
        this.reportSummaryCards = cards;
        // Select the first card by default
        this.handleSummaryClick(cards[0]);
    }

    private paintView(): void {
        this.updateCards();
    }

    private repaintView(): void {
        this.paintView();
    }
}
