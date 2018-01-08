/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
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
    OutlierInformationModel,
    LicenseAnalysisModel
} from '../models/stack-report.model';

import {
    MTab,
    MCardDetails,
    MComponentHeaderColumn,
    MReportInformation,
    MComponentDetails,
    MComponentInformation,
    MRecommendationInformation,
    MSecurityDetails,
    MSecurityIssue,
    MCrowdSourcing,
    MGithub,
    MOsio,
    MProgressMeter
} from '../models/ui.model';

@Component({
    selector: 'card-details',
    styleUrls: ['./card-details.component.less'],
    templateUrl: './card-details.component.html'
})
export class CardDetailsComponent implements OnInit, OnChanges {
    @Input() cardDetails: any;
    public report: ResultInformationModel;
    public whatCard: string;
    public details: MCardDetails = null;

    public tabs: Array<MTab> = [];

    public USER_ACTION: any = {
        'security': 'Log a bug',
        'recommendation': 'Create work item'
    };

    public cardTypes: any = {
        SECURITY: 'security',
        INSIGHTS: 'insights',
        LICENSES: 'licenses',
        COMP_DETAILS: 'compDetails'
    };

    public titleAndDescription: any = {
        [this.cardTypes.SECURITY]: {
            title: 'Components with security issues in your stack',
            description: 'Description'
        },
        [this.cardTypes.INSIGHTS]: {
            title: 'Insights on alternate or additional components that can augment your stack',
            description: 'Description'
        },
        [this.cardTypes.LICENSES]: {
            title: 'License details of components in your stack',
            description: 'Description'
        },
        [this.cardTypes.COMP_DETAILS]: {
            title: 'Component details of your manifest file',
            description: 'Description'
        }
    };

    ngOnInit() {
        
        this.paint();
    }

    ngOnChanges(changes: SimpleChanges) {
        let summary: any = changes['cardDetails'];
        
        if (summary) {
            this.cardDetails = <any> summary.currentValue;
            
            if (this.cardDetails && this.cardDetails.report) {
                this.report = this.cardDetails.report;
            } else {
                this.report = null;
            }
            this.whatCard = this.cardDetails && this.cardDetails.cardType || null;
            this.paint();
        }
    }

    public tabSelection(tab: MReportInformation): void {
        console.log(tab);
    }

    private canInclude(cardType: string, component: MComponentInformation): boolean {
        let processFlag: boolean = true;
        if (component) {
            switch (cardType) {
                case 'security':
                    processFlag = component.securityDetails && component.securityDetails.totalIssues > 0;
                    break;
                case 'insights':
                    processFlag = component.isUsageOutlier;
                    break;
                case 'licenses':
                    processFlag = component.hasLicenseIssue;
                    break;
                case 'compDetails':
                    processFlag = true;
                    break;
                default:
                    break;
            }
            return processFlag;
        }
        return false;
    }

    private getCompanionComponents(): Array<MRecommendationInformation> {
        let companions: Array<MRecommendationInformation> = [];
        if (this.report) {
            if (this.report.recommendation
                && this.report.recommendation.companion
                && this.report.recommendation.companion.length > 0) {
                let comps: Array<ComponentInformationModel> = this.report.recommendation.companion;
                
                comps.forEach((companion: ComponentInformationModel) => {
                    let security = this.getComponentSecurity(companion);
                    companions.push(new MRecommendationInformation(
                        'companion',
                        companion.reason,
                        null,
                        new MProgressMeter(
                            '',
                            Math.round(companion.confidence_reason),
                            Math.round(companion.confidence_reason) > 50 ? 'GREEN' : 'ORANGE',
                            '',
                            Math.round(companion.confidence_reason)
                        ),
                        new MComponentInformation(
                            companion.name,
                            companion.version,
                            companion.latest_version,
                            security,
                            security !== null,
                            false,
                            false,
                            companion.licenses,
                            new MCrowdSourcing(
                                companion.topic_list
                            ),
                            this.getMGithub(companion),
                            new MOsio(
                                companion.osio_user_count
                            ),
                            'Create work item',
                            true,
                            null
                        )
                    ));
                });
            }
        }
        return companions;
    }

    private getCompanionComponentDetails(): Array<MComponentDetails> {
        let comps: Array<MRecommendationInformation> = this.getCompanionComponents();
        let compDetails: Array<MComponentDetails> = [];
        if (comps && comps.length > 0) {
            comps.forEach((comp) => {
                compDetails.push(new MComponentDetails(
                    null,
                    comp
                ));
            });
        }
        return compDetails;
    }

    private decideAction(component: MComponentInformation): string {
        let action: string = null;
        if (component) {
            if (component.recommendation) {
                if (component.recommendation.componentInformation) {
                    action = component.recommendation.componentInformation.action;
                }
            } else {
                if (component.securityDetails && component.securityDetails.totalIssues > 0) {
                    action = this.USER_ACTION.security;
                }
            }
        }
        return action;
    }

    private getUIReportInformations(cardType: string): Array<MReportInformation> {
        let reportInformations: Array<MReportInformation> = [];
        let componentDetails: Array<MComponentDetails> = [];
        let componentInformation: MComponentInformation = null;
        let recommendationInformation: MRecommendationInformation = null;
        let securityDetails: MSecurityDetails = null;
        let crowd: MCrowdSourcing = null;
        let github: MGithub = null;
        let osio: MOsio = null;
        let headers: Array<MComponentHeaderColumn> = this.fillColumnHeaders(cardType);
        let compInfoType: string = 'component';
        let components: Array<ComponentInformationModel> = null;
        if (this.report.user_stack_info
            && this.report.user_stack_info.analyzed_dependencies
            && this.report.user_stack_info.analyzed_dependencies.length > 0) {
           components = this.report.user_stack_info.analyzed_dependencies;
        }
        if (components) {
            components.forEach((component: ComponentInformationModel) => {
                componentInformation = this.getComponentInformation(component);
                if (this.canInclude(cardType, componentInformation)) {
                    componentInformation.action = this.decideAction(componentInformation);
                    componentDetails.push(new MComponentDetails(
                        componentInformation,
                        recommendationInformation
                    ));
                }
            });

            let genericReport: MReportInformation = new MReportInformation(
                null,
                'component',
                this.fillColumnHeaders(cardType, 1),
                componentDetails
            );

            switch (cardType) {
                case 'security':
                    genericReport.name = 'securityTab';
                    reportInformations.push(genericReport);
                    break;
                case 'insights':
                    genericReport.name = 'Usage Outlier Details';
                    reportInformations.push(genericReport);
                    reportInformations.push(new MReportInformation(
                        'Companion Component Details',
                        'recommendation',
                        this.fillColumnHeaders(cardType, 2),
                        this.getCompanionComponentDetails()
                    ));
                    break;
                case 'licenses':
                    genericReport.name = 'Conflict License(s) details';
                    reportInformations.push(genericReport);
                    debugger;
                    reportInformations.push(new MReportInformation(
                        'Unknown license(s) details',
                        'component',
                        this.fillColumnHeaders(cardType, 2),
                        this.getUnknownLicenseComponentDetails()
                    ));
                    break;
                case 'compDetails':
                    genericReport.name = 'Analyzed component Details';
                    reportInformations.push(genericReport);
                    reportInformations.push(new MReportInformation(
                        'Unknown Component details',
                        'component',
                        this.fillColumnHeaders(cardType, 2),
                        this.getUnknownComponentDetails(cardType)
                    ));
                    break;
                default:
                    break;
            }
            return reportInformations;
        }
        return null;
    }

    private hasUnknownLicense(component: ComponentInformationModel): boolean {
        if (component) {
            return component.license_analysis && component.license_analysis.unknown_licenses && component.license_analysis.unknown_licenses.length > 0;
        }
        return false;
    }

    private getUnknownLicenseComponentDetails(): Array<MComponentDetails> {
        debugger;
        let unknownLicenseComps: Array<MComponentDetails> = null;
        let components: Array<ComponentInformationModel> = null;
        if (this.report.user_stack_info
            && this.report.user_stack_info.analyzed_dependencies
            && this.report.user_stack_info.analyzed_dependencies.length > 0) {
           components = this.report.user_stack_info.analyzed_dependencies;
        }
        if (components) {
            unknownLicenseComps = [];
            components.forEach((component: ComponentInformationModel) => {
                if (this.hasUnknownLicense(component)) {
                    unknownLicenseComps.push(new MComponentDetails(
                        this.getComponentInformation(component),
                        null
                    ));
                }
            });
        }
        return unknownLicenseComps;
    }

    private getUnknownComponentDetails(cardType: string): Array<MComponentDetails> {
        let unknowns: Array<MComponentDetails> = [];
        let unknownComponents = (this.report && this.report.user_stack_info && this.report.user_stack_info.unknown_dependencies) || [];
        // TODO: finish logic for unknown components
        unknownComponents.forEach((unknown) => {
            
        });
        return unknowns;
    }

    private getMGithub(component: ComponentInformationModel): MGithub {
        let github: MGithub = null;
        if (component && component.github) {
            let g: GithubModel = component.github;
            github = new MGithub(
                g.contributors,
                g.forks_count,
                g.dependent_repos,
                g.stargazers_count,
                g.used_by && g.used_by.length || -1,
                g.used_by
            );
        }
        return github;
    }

    private getComponentInformation(component: ComponentInformationModel): MComponentInformation {
        if (component) {
            let currentVersion: string = component.version;
            let latestVersion: string = component.latest_version;
            let github: GithubModel = component.github;
            let hasLicenseIssue: boolean = component.license_analysis && component.license_analysis.conflict_licenses && component.license_analysis.conflict_licenses.length > 0;
            debugger;
            let isUsageOutlier: boolean = false;
            let securityDetails: MSecurityDetails = this.getComponentSecurity(component);
            let recommendation: RecommendationsModel = this.report.recommendation;
            let recommendationInformation: MRecommendationInformation = null;
            let usageOutliers: Array<OutlierInformationModel> = null;
            if (recommendation) {
                usageOutliers = recommendation.usage_outliers;
                if (usageOutliers) {
                    let outlierLen: number = usageOutliers.length;
                    for (let i = 0; i < outlierLen; ++ i) {
                        if (component.name === usageOutliers[i].package_name) {
                            isUsageOutlier = true;
                            break;
                        }
                    }
                }
                if (recommendation.alternate && recommendation.alternate.length > 0) {
                    let alternates: Array<ComponentInformationModel> = recommendation.alternate;
                    let alternatesLen: number = alternates.length;
                    for (let i = 0; i < alternatesLen; ++ i) {
                        if (alternates[i].replaces && alternates[i].replaces[0] && alternates[i].replaces[0].name) {
                            let alternate: ComponentInformationModel = alternates[i];
                            if (component.name === alternate.replaces[0].name) {
                                let alterSecurity: MSecurityDetails = this.getComponentSecurity(alternate);
                                recommendationInformation = new MRecommendationInformation(
                                    'alternate',
                                    alternate.reason,
                                    false,
                                    new MProgressMeter(
                                        Math.round(alternate.confidence_reason) + '%',
                                        Math.round(alternate.confidence_reason),
                                        Math.round(alternate.confidence_reason) > 50 ? 'GREEN' : 'ORANGE',
                                        '',
                                        Math.round(alternate.confidence_reason)
                                    ),
                                    new MComponentInformation(
                                        alternate.name,
                                        alternate.version,
                                        alternate.latest_version,
                                        alterSecurity,
                                        alterSecurity !== null,
                                        false,
                                        false,
                                        alternate.licenses,
                                        new MCrowdSourcing(alternate.topic_list),
                                        this.getMGithub(alternate),
                                        new MOsio(alternate.osio_user_count),
                                        'Create work item',
                                        false,
                                        null
                                    )
                                );
                                break;
                            }
                        }
                    }
                }
            }
            return new MComponentInformation(
                component.name,
                currentVersion,
                latestVersion,
                securityDetails,
                securityDetails !== null,
                isUsageOutlier,
                hasLicenseIssue,
                component.licenses,
                new MCrowdSourcing(
                    component.topic_list
                ),
                this.getMGithub(component),
                new MOsio(component.osio_user_count),
                null,
                true,
                recommendationInformation
            );
        }
        return null;
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

    private getComponentSecurity(component: ComponentInformationModel): MSecurityDetails {
        return this.getComponentSecurityInformation(component);
    }

    private getTitleAndDescription(cardType: string): any {
        let { title, description } = this.titleAndDescription[cardType];
        return {
            title: title,
            description: description
        };
    }

    private fillColumnHeaders(cardType: string, tabNo: number = null): Array<MComponentHeaderColumn> {
        let headers: Array<MComponentHeaderColumn> = [];

        headers.push(new MComponentHeaderColumn(
            'serial',
            '#',
            'float-left extra-small'
        ));
        switch (cardType) {
            case 'security':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'cveCount',
                    'No. of CVE(s)',
                    'float-left small'
                ));
                headers.push(new MComponentHeaderColumn(
                    'highestCVSS',
                    'Highest CVSS Score',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'cveIdOfH',
                    'CVE ID of highest CVSS score',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                break;
            case 'insights':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Components',
                        'float-left medium'
                    ));
                } else if (tabNo === 2) {

                }
                headers.push(new MComponentHeaderColumn(
                    'confidence',
                    'Confidence Score',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'feedback',
                    'Feedback',
                    'float-left small'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                break;
            case 'licenses':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'licensesAffected',
                        'Licenses Affected',
                        'float-left medium'
                    ));

                } else if (tabNo === 2) {
                    headers.push(new MComponentHeaderColumn(
                        'unknownLicenses',
                        'Unknown License',
                        'float-left medium'
                    ));
                }
                headers.push(new MComponentHeaderColumn(
                    'alternate',
                    'Alternate Components',
                    'float-left medium'
                ));
                headers.push(new MComponentHeaderColumn(
                    'action',
                    'Action',
                    'float-left small'
                ));
                break;
            case 'compDetails':
                headers.push(new MComponentHeaderColumn(
                    'component',
                    'Components',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'componentCheck',
                        'Component Check',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Components',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'action',
                        'Action',
                        'float-left small'
                    ));
                } else if (tabNo === 2) {
                    headers.push(new MComponentHeaderColumn(
                        'helpUsKnownMore',
                        'Help us Know more about this component',
                        'float-left large'
                    ));
                }
                break;
            default:
                break;
        }
        return headers;
    }

    private paint(): void {
        this.tabs = [];
        if (this.report && this.whatCard) {
            let reports: Array<MReportInformation> = this.getUIReportInformations(this.whatCard);
            this.details = new MCardDetails();
            let { title, description } = this.getTitleAndDescription(this.whatCard);

            this.details.reportInformations = reports;
            this.details.isMultiple = true;
            this.details.title = title;
            this.details.titleDescription = description;
            reports.forEach((report: MReportInformation) => {
                this.tabs.push(new MTab(
                    report.name,
                    report
                ));
            });
        }
    }
}
