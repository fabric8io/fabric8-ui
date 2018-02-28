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
            bg: '#f5a625',
            icon: 'pficon-warning-triangle-o'
        },
        good: {
            bg: '#6dc663',
            icon: 'fa fa-check'
        }
    };

    public colors: any = {
        security: {
            warning: '#d1011c',
            moderate: '#f5a625'
        },
        confidence: {
            good: '#6dc663'
        }
    };

    public cardTypes: any = {
        SECURITY: 'security',
        INSIGHTS: 'insights',
        LICENSES: 'licenses',
        COMP_DETAILS: 'compDetails'
    };

    public titleAndDescription: any = {
        [this.cardTypes.SECURITY]: {
            title: 'Dependencies with security issues in your stack',
            description: 'Dependencies with high common vulnerabilities and exposures (CVE) score.  Click this card to see the details of all CVE(s).',
            descriptionShort: 'Click this card to see details of CVEs in your stack.'
        },
        [this.cardTypes.INSIGHTS]: {
            title: 'Insights on alternate or additional dependencies that can augment your stack',
            description: 'Suggested dependencies that can be added to your application stack or replace current dependencies with alternate one. Click to see details.',
            descriptionShort: 'Click this card to see suggested dependencies that complement your stack.'
        },
        [this.cardTypes.LICENSES]: {
            title: 'License details of dependencies in your stack',
            description: 'Recommended license for your application stack, flag any unknown/restrictive license(s) present. Click this card to see the detailed information.',
            descriptionShort: 'Click this card to see detailed license information for your stack.'
        },
        [this.cardTypes.COMP_DETAILS]: {
            title: 'Dependency details of your manifest file',
            description: 'Dependencies analyzed based on versions and popularity. Click this card to see security, license and usage information for each dependency.'
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
        securityCard.identifier = this.cardTypes.SECURITY;
        securityCard.reportSummaryTitle.titleIcon = 'fa fa-shield';
        securityCard.reportSummaryDescription =
            this.titleAndDescription[this.cardTypes.SECURITY].description;
        securityCard.reportSummaryDescriptionShort =
            this.titleAndDescription[this.cardTypes.SECURITY].descriptionShort;
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
                let securityColor: string = Number(maxIssue.CVSS) >= 7 ? this.colors.security.warning : this.colors.security.moderate;

                let maxIssueEntry: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
                maxIssueEntry.infoText = 'Highest CVSS Score';
                maxIssueEntry.infoValue = maxIssue.CVSS;
                maxIssueEntry.infoType = 'progress';
                maxIssueEntry.config = {
                    headerText: maxIssue.CVSS + ' / ' + 10,
                    value: Number(maxIssue.CVSS),
                    bgColor: securityColor,
                    footerText: 'No. of dependencies with this CVSS Score: ' + totalComponentsWithMaxScore,
                    width: Number(maxIssue.CVSS) * 10
                };
                securityCard.reportSummaryContent.infoEntries.push(maxIssueEntry);
                securityCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                securityCard.reportSummaryTitle.notificationIconBgColor = securityColor;
                securityCard.hasWarning = true;
                securityCard.severity = Number(maxIssue.CVSS) >= 7 ? 1 : 2;
            } else {
                // securityCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
                // securityCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
                securityCard.hasWarning = false;
            }

        } else {
            // Handle for no analyzed_dependencies
        }
        return securityCard;
    }

    public getInsightsReportCard(recommendation: RecommendationsModel): MReportSummaryCard {
        let insightsCard: MReportSummaryCard = this.newCardInstance();
        insightsCard.identifier = this.cardTypes.INSIGHTS;
        insightsCard.reportSummaryTitle.titleText = 'Insights';
        insightsCard.reportSummaryTitle.titleIcon = 'pficon-zone';
        insightsCard.reportSummaryDescription = this.titleAndDescription[this.cardTypes.INSIGHTS].description;
        insightsCard.reportSummaryDescriptionShort = this.titleAndDescription[this.cardTypes.INSIGHTS].descriptionShort;
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
            companionInsights.infoText = 'Companion Dependencies';
            companionInsights.infoValue = companionCount;
            insightsCard.reportSummaryContent.infoEntries.push(companionInsights);

            // insightsCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
            // insightsCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
            insightsCard.hasWarning = false;
            if (usageOutliersCount > 0) {
                insightsCard.reportSummaryTitle.notificationIcon = this.notification.warning.icon;
                insightsCard.reportSummaryTitle.notificationIconBgColor = this.colors.security.moderate;
                insightsCard.hasWarning = true;
            }

        } else {
            // Handle no recommendations block scenario
        }

        return insightsCard;
    }

    public getLicensesReportCard(userStackInfo: UserStackInfoModel): MReportSummaryCard {
        let licensesCard: MReportSummaryCard = this.newCardInstance();
        licensesCard.identifier = this.cardTypes.LICENSES;
        licensesCard.reportSummaryTitle.titleText = 'Licenses';
        licensesCard.reportSummaryTitle.titleIcon = 'fa fa-file-text-o';
        licensesCard.reportSummaryDescription = this.titleAndDescription[this.cardTypes.LICENSES].description;
        licensesCard.reportSummaryDescriptionShort = this.titleAndDescription[this.cardTypes.LICENSES].descriptionShort;
        licensesCard.reportSummaryContent.infoEntries = [];

        if (userStackInfo &&
            userStackInfo.license_analysis) {
            let licenseAnalysis: StackLicenseAnalysisModel;
            licenseAnalysis = userStackInfo.license_analysis;

            let stackLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            stackLicense.infoText = 'Recommended License';
            let stackLicenses = licenseAnalysis.f8a_stack_licenses;
            if (stackLicenses) {
                if (stackLicenses.length > 0) {
                    stackLicense.infoValue = stackLicenses[0];
                } else {
                    stackLicense.infoValue = 'None';
                    if (licenseAnalysis.status && licenseAnalysis.status.toLowerCase() === 'failure') {
                        stackLicense.infoValue = 'Unknown';
                    }
                }
            } else {
                // Null
            }
            licensesCard.reportSummaryContent.infoEntries.push(stackLicense);

            let conflictLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            conflictLicense.infoText = 'License Conflicts';
            let conflictLicenses = licenseAnalysis.conflict_packages;
            conflictLicense.infoValue = conflictLicenses ? conflictLicenses.length : 0;
            if (stackLicense.infoValue === 'Unknown') {
                conflictLicense.infoValue = 'NA';
            }
            licensesCard.reportSummaryContent.infoEntries.push(conflictLicense);

            let unknownLicense: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            unknownLicense.infoText = 'Unknown Licenses';
            let unknownLicenses = licenseAnalysis.unknown_licenses.really_unknown;
            unknownLicense.infoValue = unknownLicenses ? unknownLicenses.length : 0;
            if (stackLicense.infoValue === 'Unknown') {
                unknownLicense.infoValue = 'NA';
            }
            licensesCard.reportSummaryContent.infoEntries.push(unknownLicense);

            if (stackLicense.infoValue !== 'NONE' && stackLicense.infoValue !== 'Unknown') {
                let restrictiveLicenses: MReportSummaryInfoEntry = new MReportSummaryInfoEntry();
            restrictiveLicenses.infoText = 'Restrictive Licenses';
                let restrictive = licenseAnalysis.outlier_packages;
                restrictiveLicenses.infoValue = restrictive ? restrictive.length : 0;
                licensesCard.reportSummaryContent.infoEntries.push(restrictiveLicenses);
            }

            // licensesCard.reportSummaryTitle.notificationIcon = this.notification.good.icon;
            // licensesCard.reportSummaryTitle.notificationIconBgColor = this.notification.good.bg;
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
