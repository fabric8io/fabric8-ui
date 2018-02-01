export class MReportSummaryTitle {
    titleIcon: string;
    titleText: string;
    notificationIcon?: string;
    notificationIconBgColor?: string;

    // constructor(titleIcon: string, title: string, notificationIcon: string = null) {
    //     this.titleIcon = titleIcon;
    //     this.title = title;
    //     this.notificationIcon = notificationIcon;
    // }
}

export class MTab {
    constructor(
        public title: string,
        public content: MReportInformation,
        public active: boolean = false
    ) {}
}

export class MReportSummaryInfoEntry {
    public infoText: string;
    public infoValue: any;
    public infoType: string = 'text'; // Defaults to text, can also have chart
    public config?: any; // Can be made as a class later. It can have chart type, values and other related configurations
}

export class MReportSummaryContent {
    public infoEntries: Array<MReportSummaryInfoEntry>;
}

export class MReportSummaryCard {
    identifier: string;
    reportSummaryTitle: MReportSummaryTitle;
    reportSummaryDescription: string;
    reportSummaryDescriptionShort: string;
    reportSummaryContent: MReportSummaryContent;
    hasWarning?: boolean;
    severity?: number; // 1 critical, 2 moderate, ...
}

export class MProgressMeter {
    constructor(
        public headerText: string,
        public value: number,
        public bgColor: string,
        public footerText: string,
        public width: number
    ) {}
}

/** Bottom Section */
export class MGithub {
    constructor(
        public contributors: number = -1,
        public forks: number = -1,
        public depRepos: number = -1,
        public stars: number = -1,
        public usage: number = -1,
        public users: Array<any>
    ) {}
}

export class MOsio {
    constructor(usage: number = -1) {}
}

export class MCrowdSourcing {
    constructor(
        public tags: Array<string>,
        public canSuggestTags: boolean = true
    ) {}
}

export class MSecurityIssue {
    constructor(
        public cvss: string,
        public cve: string
    ) {}
}

export class MSecurityDetails {
    constructor(
        public highestIssue: MSecurityIssue = null,
        public progressReport: MProgressMeter = null,
        public totalIssues: number = null
    ) {}
}

export class MLicenseInformation {
    constructor(
        public licenses: Array<string>,
        public unknownLicenses: Array<string>,
        public hasLicenseIssue: boolean,
        public licensesAffected: Array<MLicensesAffected> = null
    ) {}
}

export class MWorkItem {
    constructor(
        public isWorkItemCreated = false,
        public url?: string
    ) {}
}

export class MComponentInformation {
    constructor(
        public name: string,
        public currentVersion: string = 'NA',
        public latestVersion: string = 'NA',
        public securityDetails: MSecurityDetails = null,
        public hasSecurityIssue: boolean,
        public isUsageOutlier: boolean,
        public hasLicenseIssue: boolean,
        public licenses: Array<string>,
        public crowdSourcing: MCrowdSourcing,
        public github: MGithub,
        public osio: MOsio,
        public action: string = null,
        public needsExpansion: boolean = true,
        public recommendation: MRecommendationInformation = null,
        public isOpen: boolean = false,
        public licenseInformation: MLicenseInformation,
        public ecosystem: string,
        public manifestFilePath?: string,
        public workItem = new MWorkItem()
    ) {}
}

export class MStackLicenseConflictDetails {
    constructor(
        public conflictedWithLicense: string,
        public conflictedWithComponent: string,
        public conflictedForLicense: string
    ) {}
}

export class MConflictsWithInLicenses {
    constructor(
        public license1: string,
        public license2: string
    ) {}
}

export class MLicensesAffected {
    constructor(
        public affectedLicenses: Array<MConflictsWithInLicenses> = null,
        public conflictType: string,
        public conflictDetails: Array<MStackLicenseConflictDetails> = null
    ) {}
}

export class MRecommendationInformation {
    constructor(
        public type: string, // Alternate or companion
        public reason: string = null,
        public feedback: MComponentFeedback = null,
        public confidenceScore: MProgressMeter,
        public componentInformation: MComponentInformation,
        public manifestFilePath?: string,
        public workItem = new MWorkItem()
    ) {}
}

export class MComponentDetails {
    constructor(
        public componentInformation: MComponentInformation = null,
        public recommendationInformation: MRecommendationInformation = null
    ) {}
}

export class MComponentHeaderColumn {
    constructor(
        public identifier: string,
        public text: string,
        public className: string,
        public isSortable: boolean = false,
        public isDragable: boolean = false
    ) {}
}

export class MReportInformation {
    constructor(
        public identifier: string,
        public name: string,
        public type: string,
        public headers: Array<MComponentHeaderColumn>,
        public componentDetails: Array<MComponentDetails>
    ) {}
}

export class MCardDetails {
    title: string;
    titleDescription: string;
    isMultiple?: boolean = true; // This is for tabs, in case it is false, report won't be rendered inside tabs
    reportInformations: Array<MReportInformation>;
}

export class MGenericStackInformation {
    constructor(
        public stackId: string,
        public baseUrl: string
    ) {}
}

export class MFeedbackTemplate {
    constructor(
        public stack_id: string,
        public recommendation_type: string,
        public package_name: string,
        public feedback_type: boolean = null,
        public ecosystem: string
    ) {}
}

export class MComponentFeedback {
    constructor(
        public feedbackTemplate: MFeedbackTemplate,
        public baseUrl: string
    ) {}
}
/** Bottom Section */
