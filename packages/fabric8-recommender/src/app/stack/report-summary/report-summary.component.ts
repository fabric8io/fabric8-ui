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

    public notification: any = {
        warning: {
            bg: '#ff6162',
            icon: 'pficon-warning-triangle-o'
        },
        good: {
            bg: 'GREEN',
            icon: 'fa fa-check'
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

    private newCardInstance(): MReportSummaryCard {
        let newCard: MReportSummaryCard = new MReportSummaryCard();
        newCard.reportSummaryContent = new MReportSummaryContent();
        newCard.reportSummaryTitle = new MReportSummaryTitle();
        return newCard;
    }

    private getSecurityReportCard(): MReportSummaryCard {
        // Initialize the new card
        let securityCard: MReportSummaryCard = this.newCardInstance();

        securityCard.reportSummaryTitle.titleIcon = 'fa fa-shield';
        securityCard.reportSummaryDescription = 'This shows the Security Description and it can go to more than a line';
        securityCard.reportSummaryTitle.titleText = 'Security Issues';
        securityCard.reportSummaryContent.infoEntries = [];


        if (this.report.user_stack_info &&
            this.report.user_stack_info.analyzed_dependencies &&
            this.report.user_stack_info.analyzed_dependencies.length > 0) {

                let securityIssues: number = 0;
                let maxIssue: SecurityInformationModel = null,
                temp: SecurityInformationModel = null;

                let analyzedDependencies: Array<ComponentInformationModel>;
                analyzedDependencies = this.report.user_stack_info.analyzed_dependencies;
                analyzedDependencies.forEach((analyzed) => {
                    if (analyzed.security && analyzed.security.length > 0) {
                        let currSecurity: Array<SecurityInformationModel> = analyzed.security;
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
                });
                let totalComponentsWithMaxScore: number = 0;
                analyzedDependencies.forEach((analyzed) => {
                    if (analyzed.security && analyzed.security.length > 0) {
                        let currSecurity: Array<SecurityInformationModel> = analyzed.security;
                        let filters: Array<SecurityInformationModel>;
                        filters = currSecurity.filter((security) => {
                            return security.CVSS === maxIssue.CVSS;
                        });
                        totalComponentsWithMaxScore += filters ? filters.length : 0;
                    }
                });

                let totalIssuesEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
                totalIssuesEntry.infoText = 'Total issues found';
                totalIssuesEntry.infoValue = securityIssues;
                securityCard.reportSummaryContent.infoEntries.push(totalIssuesEntry);

                if (maxIssue) {
                    let maxIssueEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
                    maxIssueEntry.infoText = 'Highest CVSS Score';
                    maxIssueEntry.infoValue = maxIssue.CVSS;
                    maxIssueEntry.infoType = 'progress';
                    maxIssueEntry.config = {
                        headerText: maxIssue.CVSS + ' / ' + 10,
                        value: Number(maxIssue.CVSS),
                        bgColor: Number(maxIssue.CVSS) >= 7 ? '#ff6162' : 'ORANGE',
                        footerText: 'No. of components with this CVSS Score: ' + totalComponentsWithMaxScore
                    };
                    securityCard.reportSummaryContent.infoEntries.push(maxIssueEntry);
                    securityCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                    securityCard.reportSummaryTitle.notificationIconBgColor = this.notification.warning.bg;
                } else {
                    securityCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
                    securityCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
                }

        } else {
            // Handle for no analyzed_dependencies
        }
        return securityCard;
    }

    private getInsightsReportCard(): MReportSummaryCard {
        let insightsCard: MReportSummaryCard = this.newCardInstance();

        insightsCard.reportSummaryTitle.titleText = 'Insights';
        insightsCard.reportSummaryTitle.titleIcon = 'pficon-zone';
        insightsCard.reportSummaryDescription = 'This shows the Insights Description and it can go to more than a line';
        insightsCard.reportSummaryContent.infoEntries = [];

        let recommendation: RecommendationsModel;
        recommendation = this.report.recommendation;
        let usageOutliersCount: number = 0, companionCount: number = 0;
        if (recommendation) {
            let usage = recommendation.usage_outliers;
            usageOutliersCount = usage ? usage.length : 0;
            companionCount = recommendation.companion ? recommendation.companion.length : 0;

            let totalInsights: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            totalInsights.infoText = 'Total Insights';
            totalInsights.infoValue = usageOutliersCount + companionCount;
            insightsCard.reportSummaryContent.infoEntries.push(totalInsights);

            let outliersInsights: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            outliersInsights.infoText = 'Usage Outliers';
            outliersInsights.infoValue = usageOutliersCount;
            insightsCard.reportSummaryContent.infoEntries.push(outliersInsights);

            let companionInsights: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            companionInsights.infoText = 'Companion Components';
            companionInsights.infoValue = companionCount;
            insightsCard.reportSummaryContent.infoEntries.push(companionInsights);

            insightsCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
            insightsCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
            if (usageOutliersCount > 0) {
                insightsCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                insightsCard.reportSummaryTitle.notificationIconBgColor = this.notification.warning.bg;
            }

        } else {
            // Handle no recommendations block scenario
        }

        return insightsCard;
    }

    private getLicensesReportCard(): MReportSummaryCard {
        let licensesCard: MReportSummaryCard = this.newCardInstance();

        licensesCard.reportSummaryTitle.titleText = 'Licenses';
        licensesCard.reportSummaryTitle.titleIcon = 'fa fa-bolt';
        licensesCard.reportSummaryDescription = 'This shows the Licenses Description and it can go to more than a line';
        licensesCard.reportSummaryContent.infoEntries = [];

        if (this.report.user_stack_info &&
            this.report.user_stack_info.license_analysis) {
            let licenseAnalysis: StackLicenseAnalysisModel;
            licenseAnalysis = this.report.user_stack_info.license_analysis;

            let stackLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            stackLicense.infoText = 'Stack Level License';
            let stackLicenses = licenseAnalysis.f8a_stack_licenses;
            stackLicense.infoValue = stackLicenses && stackLicenses.length > 0 ? stackLicense[0] : 'NONE';
            licensesCard.reportSummaryContent.infoEntries.push(stackLicense);

            let conflictLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            conflictLicense.infoText = 'License Conflicts';
            let conflictLicenses = licenseAnalysis.conflict_packages;
            conflictLicense.infoValue = conflictLicenses ? conflictLicenses.length : 0;
            licensesCard.reportSummaryContent.infoEntries.push(conflictLicense);

            let unknownLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            unknownLicense.infoText = 'Unknown Licenses';
            let unknownLicenses = licenseAnalysis.unknown_licenses.really_unknown;
            unknownLicense.infoValue = unknownLicenses ? unknownLicenses.length : 0;
            licensesCard.reportSummaryContent.infoEntries.push(unknownLicense);

            licensesCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
            licensesCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
            if (conflictLicenses.length > 0 || unknownLicenses.length > 0) {
                licensesCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                licensesCard.reportSummaryTitle.notificationIconBgColor = this.notification.warning.bg;
            }
        } else {
            // Handle no licenses section scenario
        }

        return licensesCard;
    }

    private getComponentDetailsReportCard(): MReportSummaryCard {
        let componentDetailsCard: MReportSummaryCard = this.newCardInstance();

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
