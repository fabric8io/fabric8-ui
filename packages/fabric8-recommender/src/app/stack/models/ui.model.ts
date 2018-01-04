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
    reportSummaryTitle: MReportSummaryTitle;
    reportSummaryDescription: string;
    reportSummaryContent: MReportSummaryContent;
}

export class MProgressMeter {
    headerText: string;
    value: number;
    bgColor: string;
    footerText: string;
}
