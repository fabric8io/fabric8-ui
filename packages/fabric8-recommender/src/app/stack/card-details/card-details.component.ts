/** Vendor imports Go HERE */
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    ViewEncapsulation,
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
    LicenseAnalysisModel,
    ComponentConflictUnknownModel,
    ConflictPackageModel,
    ReallyUnknownLicenseModel
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
    MProgressMeter,
    MGenericStackInformation,
    MLicensesAffected,
    MConflictsWithInLicenses,
    MStackLicenseConflictDetails,
    MLicenseInformation,
    MComponentFeedback,
    MFeedbackTemplate
} from '../models/ui.model';

@Component({
    selector: 'card-details',
    styleUrls: ['./card-details.component.less'],
    encapsulation: ViewEncapsulation.None,
    templateUrl: './card-details.component.html'
})
export class CardDetailsComponent implements OnInit, OnChanges {
    @Input() cardDetails: any;
    @Input() genericInformation: MGenericStackInformation;
    @Input() repoInfo: any;
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
            title: 'Dependencies with security issues in your stack',
            description: 'A list of the dependencies affected with common vulnerabilities and exposures (CVE), dependency with the highest common vulnerability score (CVSS), and its CVE ID. You can take corrective actions by reporting the issues.'
        },
        [this.cardTypes.INSIGHTS]: {
            title: 'Insights on alternate or additional dependencies that can augment your stack',
            description: 'A list of dependencies that are not commonly used in similar stacks, suggestions for alternate dependencies to replace them, and suggestions for additional dependencies to complement your stack. Take corrective action by creating a work item in planner or leave us feedback.'
        },
        [this.cardTypes.LICENSES]: {
            title: 'License details of dependencies in your stack',
            description: 'A list of stack and dependency level license conflicts, licenses unknown to Openshift.io and suggestions for alternate dependencies to resolve these issues. Create a work item in planner to replace these dependencies.'
        },
        [this.cardTypes.COMP_DETAILS]: {
            title: 'Dependency details of your manifest file',
            description: 'A list of all the analyzed dependencies that flags security, usage, and license issues in your stack and suggests alternate dependencies to replace dependencies with these issues. Take corrective action by creating a work item in planner. It also lists dependencies unknown to Openshift.io.'
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

    private getMComponentFeedback(type: string, component: ComponentInformationModel): MComponentFeedback {
        let feedback: MComponentFeedback = null;
        if (this.genericInformation && this.genericInformation.stackId && component) {
            feedback = new MComponentFeedback(
                new MFeedbackTemplate(
                    this.genericInformation.stackId,
                    type,
                    component.name,
                    null,
                    component.ecosystem
                ),
                this.genericInformation.baseUrl
            );
        }
        return feedback;
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
                    let progress: MProgressMeter = null;
                    if (companion && companion.confidence_reason) {
                        progress = new MProgressMeter(
                            Math.round(companion.confidence_reason) + '%',
                            Math.round(companion.confidence_reason),
                            Math.round(companion.confidence_reason) > 50 ? '#6ec664' : 'ORANGE',
                            '',
                            Math.round(companion.confidence_reason)
                        );
                    }
                    companions.push(new MRecommendationInformation(
                        'companion',
                        companion.reason,
                        this.getMComponentFeedback('companion', companion),
                        progress,
                        new MComponentInformation(
                            companion.name,
                            '-----',
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
                            null,
                            false,
                            null,
                            companion.ecosystem
                        ),
                        this.report.manifest_file_path
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
        }

        let genericReport: MReportInformation = new MReportInformation(
            null,
            null,
            'component',
            this.fillColumnHeaders(cardType, 1),
            componentDetails
        );

        let compDetails: Array<MComponentDetails> = [];
        switch (cardType) {
            case 'security':
                genericReport.identifier = 'security';
                genericReport.name = 'securityTab';
                reportInformations.push(genericReport);
                break;
            case 'insights':
                genericReport.identifier = 'ins-usage';
                genericReport.name = 'Usage Outlier Details';
                reportInformations.push(genericReport);

                compDetails = this.getCompanionComponentDetails();
                reportInformations.push(new MReportInformation(
                    'ins-companion',
                    'Companion Dependency Details',
                    'recommendation',
                    this.fillColumnHeaders(cardType, 2),
                    compDetails
                ));
                break;
            case 'licenses':
                genericReport.identifier = 'lic-conflicts';
                genericReport.name = 'Conflicting License(s) Details';
                reportInformations.push(genericReport);

                compDetails = this.getUnknownLicenseComponentDetails();
                reportInformations.push(new MReportInformation(
                    'lic-unknown',
                    'Unknown License(s) Details',
                    'component',
                    this.fillColumnHeaders(cardType, 2),
                    compDetails
                ));
                break;
            case 'compDetails':
                genericReport.identifier = 'comp-analyzed';
                genericReport.name = 'Analyzed Dependency Details';
                reportInformations.push(genericReport);

                compDetails = this.getUnknownComponentDetails(cardType);
                reportInformations.push(new MReportInformation(
                    'comp-unknown',
                    'Unknown Dependency Details',
                    'component',
                    this.fillColumnHeaders(cardType, 2),
                    compDetails
                ));
                break;
            default:
                break;
        }
        return reportInformations;
    }

    private hasUnknownLicense(component: ComponentInformationModel): boolean {
        if (component) {
            let licenseAnalysis: StackLicenseAnalysisModel = this.getLicensesAnalysis();
            if (licenseAnalysis &&
                licenseAnalysis.unknown_licenses &&
                licenseAnalysis.unknown_licenses.really_unknown &&
                licenseAnalysis.unknown_licenses.really_unknown.length > 0
            ) {
                let reallyUnknown = licenseAnalysis.unknown_licenses.really_unknown;
                let len: number = reallyUnknown.length;
                for (let i = 0; i < len; ++ i) {
                    if (reallyUnknown[i].package === component.name) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    private getUnknownLicenseComponentDetails(): Array<MComponentDetails> {
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
        unknownComponents.forEach((unknown) => {
            unknowns.push(new MComponentDetails(
                new MComponentInformation(
                    unknown.name,
                    unknown.version,
                    '',
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    false,
                    null,
                    false,
                    null,
                    null,
                    null,
                    null
                ),
                null
            ));
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

    private getLicensesAnalysis(): StackLicenseAnalysisModel {
        if (this.report) {
            if (this.report.user_stack_info
                && this.report.user_stack_info.license_analysis
                && this.report.user_stack_info.license_analysis
            ) {
                return this.report.user_stack_info.license_analysis;
            }
        }
        return null;
    }

    private hasLicenseIssue(component: ComponentInformationModel): boolean {
        if (component) {
            let analysis: StackLicenseAnalysisModel = this.getLicensesAnalysis();
            if (analysis) {
                return (analysis.conflict_packages
                    && analysis.conflict_packages.length > 0)
                    || (analysis.unknown_licenses && analysis.unknown_licenses.component_conflict &&
                    analysis.unknown_licenses.component_conflict.length > 0);
            }
        }
        return false;
    }

    private getComponentInformation(component: ComponentInformationModel): MComponentInformation {
        if (component) {
            let currentVersion: string = component.version;
            let latestVersion: string = component.latest_version;
            let github: GithubModel = component.github;
            let hasLicenseIssue: boolean = this.hasLicenseIssue(component);
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
                                let progress: MProgressMeter = null;
                                if (alternate && alternate.confidence_reason) {
                                    progress = new MProgressMeter(
                                        Math.round(alternate.confidence_reason) + '%',
                                        Math.round(alternate.confidence_reason),
                                        Math.round(alternate.confidence_reason) > 50 ? '#6ec664' : 'ORANGE',
                                        '',
                                        Math.round(alternate.confidence_reason)
                                    );
                                }
                                recommendationInformation = new MRecommendationInformation(
                                    'alternate',
                                    alternate.reason,
                                    this.getMComponentFeedback('alternate', alternate),
                                    progress,
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
                                        null,
                                        false,
                                        null,
                                        alternate.ecosystem
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
                recommendationInformation,
                false,
                new MLicenseInformation(
                    component.licenses,
                    this.getUnknownLicenses(component),
                    hasLicenseIssue,
                    this.getMLicenseAffected(component)
                ),
                component.ecosystem,
                this.report.manifest_file_path
            );
        }
        return null;
    }

    private getUnknownLicenses(component: ComponentInformationModel): Array<string> {
        let unknownLicenses: Array<string> = [];
        if (component) {
            if (this.report) {
                let analysis: StackLicenseAnalysisModel = this.getLicensesAnalysis();
                if (analysis && analysis.unknown_licenses
                    && analysis.unknown_licenses.really_unknown
                    && analysis.unknown_licenses.really_unknown.length > 0
                ) {
                    let reallyUnknown: Array<ReallyUnknownLicenseModel> = analysis.unknown_licenses.really_unknown;
                    reallyUnknown.forEach((unknown) => {
                        if (unknown.package === component.name) {
                            unknownLicenses.push(unknown.license);
                        }
                    });
                }
            }
        }
        return unknownLicenses;
    }

    private getMLicenseAffected(component: ComponentInformationModel): Array<MLicensesAffected> {
        let licensesAffected: Array<MLicensesAffected> = null;
        let analysis: StackLicenseAnalysisModel = this.getLicensesAnalysis();
        if (analysis) {
            licensesAffected = [];
            let licenseAnalysis: StackLicenseAnalysisModel = analysis;
            if (licenseAnalysis.status) {
                switch (licenseAnalysis.status.toLowerCase()) {
                    case 'componentconflict':
                        if (licenseAnalysis.unknown_licenses
                            && licenseAnalysis.unknown_licenses.component_conflict
                            && licenseAnalysis.unknown_licenses.component_conflict.length > 0
                        ) {
                            let compConflicts: Array<ComponentConflictUnknownModel> = licenseAnalysis.unknown_licenses.component_conflict;

                            let len: number = compConflicts.length;
                            for (let i = 0; i < len; ++ i) {
                                if (compConflicts[i] && compConflicts[i].package === component.name) {
                                    let affectedLicenses: Array<MConflictsWithInLicenses> = [];
                                    if (compConflicts[i].conflict_licenses && compConflicts[i].conflict_licenses.length > 0) {
                                        compConflicts[i].conflict_licenses.forEach((license) => {
                                            affectedLicenses.push(new MConflictsWithInLicenses(
                                                license.license1,
                                                license.license2
                                            ));
                                        });
                                    }
                                    licensesAffected.push(new MLicensesAffected(
                                        affectedLicenses,
                                        'componentconflict',
                                        null
                                    ));
                                }
                            }
                        }
                        break;
                    case 'stacklicenseconflict':
                        if (licenseAnalysis.conflict_packages
                            && licenseAnalysis.conflict_packages.length > 0
                        ) {
                            let stackConflicts: Array<ConflictPackageModel> = licenseAnalysis.conflict_packages;

                            let len: number = stackConflicts.length;
                            let affectedComponents: Array<MStackLicenseConflictDetails> = [];
                            for (let i = 0; i < len; ++ i) {
                                if (stackConflicts[i] && stackConflicts[i].package1 === component.name) {
                                    affectedComponents.push(new MStackLicenseConflictDetails(
                                        stackConflicts[i].license2,
                                        stackConflicts[i].package2,
                                        stackConflicts[i].license1
                                    ));
                                }
                            }
                            licensesAffected.push(new MLicensesAffected(
                                null,
                                'stackconflict',
                                affectedComponents
                            ));
                        }
                        break;
                    case 'successful':
                        break;
                    case 'unknown':
                        break;
                    case 'failure':
                        break;
                    default:

                }
            }
        }
        return licensesAffected;
    }

    private getComponentSecurityInformation(component: ComponentInformationModel): MSecurityDetails {
        if (component) {
            let securityDetails: MSecurityDetails = null;
            let securityIssues: number = 0;
            let maxIssue: SecurityInformationModel = null,
            temp: SecurityInformationModel = null;
            if (component.security && component.security.length > 0) {
                securityDetails = new MSecurityDetails();
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
                securityDetails.totalIssues = securityIssues;
            }
            if (maxIssue) {
                securityDetails.highestIssue = new MSecurityIssue(
                    maxIssue.CVSS,
                    maxIssue.CVE
                );
                securityDetails.progressReport = new MProgressMeter(
                    Number(maxIssue.CVSS) + '/10',
                    Number(maxIssue.CVSS),
                    Number(maxIssue.CVSS) >= 7 ? '#d1011c' : 'ORANGE',
                    '',
                    Number(maxIssue.CVSS) * 10
                );
            }
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
                    'Dependencies',
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
                    'Dependencies',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Dependencies',
                        'float-left medium'
                    ));
                } else if (tabNo === 2) {

                }
                headers.push(new MComponentHeaderColumn(
                    'confidence',
                    'Confidence Score',
                    'float-left extra-medium'
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
                    'Dependencies',
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
                    'Alternate Dependencies',
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
                    'Dependencies',
                    'float-left medium'
                ));
                if (tabNo === 1) {
                    headers.push(new MComponentHeaderColumn(
                        'componentCheck',
                        'Dependency Check',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'alternate',
                        'Alternate Dependencies',
                        'float-left medium'
                    ));
                    headers.push(new MComponentHeaderColumn(
                        'action',
                        'Action',
                        'float-left small'
                    ));
                } else if (tabNo === 2) {
                    // headers.push(new MComponentHeaderColumn(
                    //     'helpUsKnownMore',
                    //     'Help us Know more about this component',
                    //     'float-left large'
                    // ));
                    // Ignored for now
                }
                break;
            default:
                break;
        }
        headers.push(new MComponentHeaderColumn(
            'collapse',
            '',
            'float-right'
        ));
        if (cardType === 'compDetails' && tabNo === 2) {
            headers.pop();
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
            if (reports && reports.length > 0) {
                reports.forEach((report: MReportInformation) => {
                    this.tabs.push(new MTab(
                        report.name,
                        report
                    ));
                });
                if (this.tabs[0]) {
                    this.tabs[0].active = true;
                }
            }
        }
    }
}
