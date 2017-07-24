import { Component, Input, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import { GlobalConstants } from '../constants/constants.service';
import { StackAnalysesService } from '../stack-analyses.service';

@Component({
  selector: 'overview-stack',
  templateUrl: './overview.component.html',
  encapsulation: ViewEncapsulation.None,
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
      description: 'Lines of code',
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
      description: 'Total files',
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
      item.numeric = item.numeric < 0 || (!item.numeric && item.numeric !== 0) ? 'NA' : item.numeric;
    });
    this.codeMetricsInfo = codeMetrics;
  }

  private sortChartColumnData(array: Array<any>): Array<any> {
    return array.sort((a, b) => {
      if (a[1] === b[1]) {
        return 0;
      }
      return a[1] > b[1] ? -1 : 1;
    });
  }

  private buildLicenseChart(licenseList: Array<string>): void {
    let columnData = [];
    let columnDataLength = 0;
    let otherLicensesArray = [];
    let otherLicensesRatio = 0;
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
    // sort the data array by license count
    columnData = this.sortChartColumnData(columnData);
    columnDataLength = columnData ? columnData.length : 0;
    if (columnDataLength > 4) {
      for (let i = 3; i < columnDataLength; i++) {
        otherLicensesArray.push(columnData[i][0]);
        otherLicensesRatio += columnData[i][1];
      }
      columnData.splice(4);
      columnData[3][0] = this.messages.othersLegend;
      columnData[3][1] = otherLicensesRatio;
    }
    this.licenseChartInfo = {
      data: {
        columns: columnData,
        type: 'donut',
        labels: false
      },
      chartOptions: {
        size: {
          height: 150,
          width: 250
        },
        donut: {
          width: 13,
          label: {
            show: false
          },
          title: columnDataLength
        }
      },
      configs: {
        legend: {
          position: 'right'
        },
        tooltip: {
          format: {
            name: (name, ratio, id, index) => {
              if (name === this.messages.othersLegend) {
                return otherLicensesArray.toString();
              }
              return name;
            },
            value: (value, ratio, id, index) => {
              return (ratio * 100).toFixed(2) + '%';
            }
          }
        }
      }
    };
  }
}

