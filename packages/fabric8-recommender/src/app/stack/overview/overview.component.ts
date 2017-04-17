import { Component, Input, OnInit, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { GlobalConstants } from '../constants/constants.service';
import { StackAnalysesService } from '../stack-analyses.service';

@Component({
  selector: 'overview-stack',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnChanges {
  @Input() stackOverviewData;

  public overviewData = null;

  private cveDataList: any;
  private messages: any;
  private securityInfo: any;
  private summaryInfo: any;
  private codeMetricsInfo: Array<any>;
  private licenseChartInfo: any;

  constructor(
    private constants: GlobalConstants,
    private stackAnalysesService: StackAnalysesService) {
    this.constants.getMessages('overview').subscribe((message) => {
      this.messages = message;
    });
  }

  ngOnChanges() {
    this.summaryInfo = {
      icon: 'pficon-replicator',
      numeric: 0,
      description: 'Dependencies',
      subDescription: '(direct declared)',
      className: 'overview-depen-icon'
    };

    this.codeMetricsInfo = [{
      key: 'noOfLines',
      icon: 'fa-list-alt',
      numeric: 0,
      description: 'lines of code',
      className: 'overview-code-metric-icon'
    }, {
      key: 'avgCycloComplexity',
      icon: 'pficon-topology',
      numeric: 0,
      description: 'Avg. cyclomatic complexity',
      className: 'overview-code-metric-icon'
    }, {
      key: 'noOfFiles',
      icon: 'fa-file-o',
      numeric: 0,
      description: 'total files',
      className: 'overview-code-metric-icon'
    }];

    this.buildOverviewData();
  }

  private buildOverviewData(): void {
    this.buildSecurity(this.stackOverviewData.cvss);
    this.buildSummary(this.summaryInfo);
    this.buildCodeMetrics(this.codeMetricsInfo);
    this.buildLicenseChart(this.stackOverviewData.licenseList);
    this.overviewData = {};
    this.overviewData.securityInfo = this.securityInfo;
    this.overviewData.summaryInfo = this.summaryInfo;
    this.overviewData.codeMetricsInfo = this.codeMetricsInfo;
    this.overviewData.licenseChartInfo = this.licenseChartInfo;
  }

  private buildSecurity(cvss: any): void {
    if (cvss) {
      this.securityInfo = {};
      let cvssValue = cvss.value;
      if (cvssValue < 0) {
        this.securityInfo.value = -1;
      } else if (cvssValue < 7.0) {
        this.securityInfo.value = cvssValue;
      } else {
        let cvssObj = cvssValue >= 0 ? this.stackAnalysesService.getCvssObj(cvssValue) : null;
        this.securityInfo = cvssObj;
        this.securityInfo.id = cvss.id;
      }
    }
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
        case 'avgCycloComplexity': item.numeric = this.stackOverviewData.avgCycloComplexity;
          break;
        default:
      }
    });
    this.codeMetricsInfo = codeMetrics;
  }

  private buildLicenseChart(licenseList: Array<string>): void {
    let columnData = [];
    let licenseMap = _.groupBy(licenseList, (value) => {
      return value;
    });
    for (let key in licenseMap) {
      if (licenseMap.hasOwnProperty(key)) {
        let temp = [];
        temp.push(key);
        temp.push(licenseMap[key].length);
        columnData.push(temp);
      }
    }
    this.licenseChartInfo = {
      data: {
        columns: columnData,
        type: 'donut',
        labels: false
      },
      chartOptions: {
        size: {
          height: 240,
          width: 240
        },
        donut: {
          width: 13,
          label: {
            show: false
          }
        }
      },
      configs: {
        legend: {
          position: 'right'
        }
      }
    };
  }
}

