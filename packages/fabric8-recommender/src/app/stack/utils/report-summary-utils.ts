import {
    MReportSummaryCard,
    MReportSummaryInfoEntry,
    MReportSummaryContent,
    MReportSummaryTitle
} from '../models/ui.model';
import {
    ComponentInformationModel,
    RecommendationsModel,
    SecurityInformationModel,
    StackLicenseAnalysisModel,
    UserStackInfoModel
} from '../models/stack-report.model';

export class ReportSummaryUtils {
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

    public newCardInstance(): MReportSummaryCard {
        let newCard: MReportSummaryCard = new MReportSummaryCard();
        newCard.reportSummaryContent = new MReportSummaryContent();
        newCard.reportSummaryTitle = new MReportSummaryTitle();
        return newCard;
    }

    public getSecurityReportCard(userStackInfo: UserStackInfoModel): MReportSummaryCard {
        let securityCard: MReportSummaryCard = this.newCardInstance();
        securityCard.reportSummaryTitle.titleIcon = 'fa fa-shield';
        securityCard.reportSummaryDescription =
            'This shows the Security Description and it can go to more than a line';
        securityCard.reportSummaryTitle.titleText = 'Security Issues';
        securityCard.reportSummaryContent.infoEntries = [];


        if (userStackInfo &&
            userStackInfo.analyzed_dependencies &&
            userStackInfo.analyzed_dependencies.length > 0) {

            let securityIssues: number = 0;
            let maxIssue: SecurityInformationModel = null,
                temp: SecurityInformationModel = null;

            let analyzedDependencies: Array < ComponentInformationModel > ;
            analyzedDependencies = userStackInfo.analyzed_dependencies;
            analyzedDependencies.forEach((analyzed) => {
                if (analyzed.security && analyzed.security.length > 0) {
                    let currSecurity: Array < SecurityInformationModel > = analyzed.security;
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
                    let currSecurity: Array < SecurityInformationModel > = analyzed.security;
                    let filters: Array < SecurityInformationModel > ;
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
                securityCard.hasWarning = true;
            } else {
                securityCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
                securityCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
                securityCard.hasWarning = false;
            }

        } else {
            // Handle for no analyzed_dependencies
        }
        return securityCard;
    }

    public getInsightsReportCard(recommendation: RecommendationsModel): MReportSummaryCard {
        let insightsCard: MReportSummaryCard = this.newCardInstance();
        insightsCard.reportSummaryTitle.titleText = 'Insights';
        insightsCard.reportSummaryTitle.titleIcon = 'pficon-zone';
        insightsCard.reportSummaryDescription = 'This shows the Insights Description and it can go to more than a line';
        insightsCard.reportSummaryContent.infoEntries = [];

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
            insightsCard.hasWarning = false;
            if (usageOutliersCount > 0) {
                insightsCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                insightsCard.reportSummaryTitle.notificationIconBgColor = this.notification.warning.bg;
                insightsCard.hasWarning = true;
            }

        } else {
            // Handle no recommendations block scenario
        }

        return insightsCard;
    }

    public getLicensesReportCard(userStackInfo: UserStackInfoModel): MReportSummaryCard {
        let licensesCard: MReportSummaryCard = this.newCardInstance();
        licensesCard.reportSummaryTitle.titleText = 'Licenses';
        licensesCard.reportSummaryTitle.titleIcon = 'fa fa-bolt';
        licensesCard.reportSummaryDescription = 'This shows the Licenses Description and it can go to more than a line';
        licensesCard.reportSummaryContent.infoEntries = [];

        if (userStackInfo &&
            userStackInfo.license_analysis) {
            let licenseAnalysis: StackLicenseAnalysisModel;
            licenseAnalysis = userStackInfo.license_analysis;

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
            licensesCard.hasWarning = false;
            if (conflictLicenses.length > 0 || unknownLicenses.length > 0) {
                licensesCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                licensesCard.reportSummaryTitle.notificationIconBgColor = this.notification.warning.bg;
                licensesCard.hasWarning = true;
            }
        } else {
            // Handle no licenses section scenario
        }

        return licensesCard;
    }
}
