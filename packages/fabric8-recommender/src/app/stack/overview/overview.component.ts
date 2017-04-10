import { Component, Input, OnInit, OnChanges } from '@angular/core';
import { GlobalConstants } from '../constants/constants.service';

@Component({
  selector: 'overview-stack',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnChanges {
  @Input() stackOverviewData;

  public summaryInfo: Array<any> = [];
  public codeMetricsInfo: Array<any> = [];
  public licenseChartInfo: any = {};

  private cveDataList: any;
  private messages: any;

  constructor(private constants: GlobalConstants) {
    this.constants.getMessages('overview').subscribe((message) => {
      this.messages = message;
    });
  }

  ngOnChanges() {
    console.log(this.stackOverviewData);
    let summaryInfo: any = {
      icon: 'pficon-replicator',
      numeric: 0,
      description: 'Dependencies',
      subDescription: '(direct declared)',
      className: 'overview-depen-icon'
    };

    let codeMetrics: Array<any> = [{
      key: 'noOfLines',
      icon: 'fa-list-alt',
      numeric: 0,
      description: 'lines of code',
      className: 'overview-code-metric-icon'
    }, {
      key: 'avgCyclometricComplex',
      icon: 'pficon-virtual-machine',
      numeric: 0,
      description: 'Avg. cyclomatic complexity',
      className: 'overview-code-metric-icon'
    }, {
      key: 'noOfFiles',
      icon: 'pficon-replicator',
      numeric: 0,
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

    this.buildSummary(summaryInfo);
    this.buildCodeMetrics(codeMetrics);
    this.buildLicenseChart(licenseChart);
  }

  private buildSummary(summaryChart: any): void {
    summaryChart.numeric = this.stackOverviewData.noOfComponents;
    this.summaryInfo = summaryChart;
  }

  private buildCodeMetrics(codeMetrics: Array<any>): void {
    codeMetrics.forEach(item => {
      switch (item.key) {
        case 'noOfLines': item.numeric = this.stackOverviewData.totalNoOfLines;
          break;
        case 'noOfFiles': item.numeric = this.stackOverviewData.totalNoOfFiles;
          break;
        case 'avgCyclometricComplex': item.numeric = this.stackOverviewData.avgCyclometricComplex;
          break;
        default:
      }
    });
    this.codeMetricsInfo = codeMetrics;
  }

  private buildLicenseChart(licenseChart: any): void {
    this.licenseChartInfo = licenseChart;
  }
}

