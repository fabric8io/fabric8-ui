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
        public content: MReportInformation
    ) {}
}

export class MReportSummaryInfoEntry {
    infoText: string;
    infoValue: any;
    infoType: string = 'text'; // Defaults to text, can also have chart
    config?: any; // Can be made as a class later. It can have chart type, values and other related configurations
}

export class MReportSummaryContent {
    infoEntries: Array<MReportSummaryInfoEntry>;
}

export class MReportSummaryCard {
    identifier: string;
    reportSummaryTitle: MReportSummaryTitle;
    reportSummaryDescription: string;
    reportSummaryContent: MReportSummaryContent;
    hasWarning?: boolean;
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
        public isOpen: boolean = false
    ) {}
}

export class MRecommendationInformation {
    constructor(
        public type: string, // Alternate or companion
        public reason: string = null,
        public feedback: boolean,
        public confidenceScore: MProgressMeter,
        public componentInformation: MComponentInformation
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
/** Bottom Section */
