import { Component, Input, OnInit } from '@angular/core';
import { GlobalConstants } from '../constants/constants.service';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.component.html',
    styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
    @Input() stackOverviewData;

    public summaryChartInfo: Array<any> = [];
    public codeMetricChartInfo: Array<any> = [];
    public licenseChartInfo: any = {};

    private cveDataList: any;
    private messages: any;

    constructor(private constants: GlobalConstants) {
        this.constants.getMessages('overview').subscribe((message) => {
            this.messages = message;
        });
    }

    ngOnInit() {
        this.initOverviewComponents(this.stackOverviewData);

        let summaryChart: Array<any> = [{
            icon: 'fa-star',
            numeric: 5664,
            description: 'Github Stars',
            className: 'overview-star-icon'
        }, {
            icon: 'pficon-virtual-machine',
            numeric: 1077,
            description: 'Github forks',
            className: 'overview-fork-icon'
        }, {
            icon: 'pficon-replicator',
            numeric: 6,
            description: 'Dependencies',
            subDescription: '(direct declared)',
            className: 'overview-depen-icon'
        }];

        let codeMetricChart: Array<any> = [{
            icon: 'fa-list-alt',
            numeric: 42336,
            description: 'lines of code',
            className: 'overview-code-metric-icon'
        }, {
            icon: 'pficon-virtual-machine',
            numeric: 1.34,
            description: 'Avg. cyclomatic complexity',
            className: 'overview-code-metric-icon'
        }, {
            icon: 'pficon-replicator',
            numeric: 441,
            description: 'total files',
            className: 'overview-code-metric-icon'
        }];

        let licenseChart: any = {
            code: 'ASL 2.0',
            description: 'Common stack license',
            each: [{
                icon: 'pficon-warning-triangle-o',
                name: 'Free Art license',
                comment: 'is outlier'
            }, {
                icon: 'pficon-warning-triangle-o',
                name: 'Rsfs license',
                comment: 'is outlier'
            }, {
                icon: 'pficon-warning-triangle-o',
                name: 'MITNFA license',
                comment: 'is outlier'
            }]
        };

        this.summaryChart(summaryChart);
        this.codeMetricsChart(codeMetricChart);
        this.licenseChart(licenseChart);
    }

    private summaryChart(summaryChart: Array<any>): void {
        this.summaryChartInfo = summaryChart;
    }

    private codeMetricsChart(codeMetricChart: Array<any>): void {
        this.codeMetricChartInfo = codeMetricChart;
    }

    private licenseChart(licenseChart: any): void {
        this.licenseChartInfo = licenseChart;
    }

    private initOverviewComponents(stackOverviewData: any): void {
        if (stackOverviewData) {
            this.cveDataList = stackOverviewData.CVEdata;
        }
    }
}

