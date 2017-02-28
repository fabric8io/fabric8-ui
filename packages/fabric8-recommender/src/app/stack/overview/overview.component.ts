import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'overview-stack',
    templateUrl: './overview.html'
})
export class OverviewComponent implements OnInit {
    @Input() stackOverviewData;

    private dependenciesChart: any;
    private compUsageChart: any;
    private cveDataList: any;

    constructor() { }

    ngOnInit() {
        this.initOverviewComponents(this.stackOverviewData);
    }

    private initOverviewComponents(stackOverviewData: any): void {
        if (stackOverviewData) {
            this.setDependencyChartData(stackOverviewData);
            this.setCompUsageChartData(stackOverviewData);
            this.cveDataList = stackOverviewData.CVEdata;
        }
    }

    private getDonutChartConfig(): any {
        let chartConfig: any = {};
        chartConfig.chartOptions = {
            donut: {
                width: 50,
                title: ''
            },
            color: {
                pattern: ['#696969', '#A9A9A9']
            }
        };
        chartConfig.configs = {
            legend: {
                position: 'right'
            }
        };
        return chartConfig;
    }

    private setDependencyChartData(stackOverviewData: any): any {
        let chartDataConfig = this.getDonutChartConfig();
        this.dependenciesChart = chartDataConfig;
        this.dependenciesChart.data = {};
        this.dependenciesChart.data.columns = stackOverviewData.dependencyChart;
        this.dependenciesChart.data.type = 'donut';
        this.dependenciesChart.chartOptions.donut.title = '32 Dependencies';
    }

    private setCompUsageChartData(stackOverviewData: any): any {
        let chartDataConfig = this.getDonutChartConfig();
        this.compUsageChart = chartDataConfig;
        this.compUsageChart.data = {};
        this.compUsageChart.data.columns = stackOverviewData.compUsageChart;
        this.compUsageChart.data.type = 'donut';
        this.compUsageChart.chartOptions.donut.title = 'Component usage';
    }

}
