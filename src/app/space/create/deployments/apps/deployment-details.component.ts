import {
  Component,
  Input
} from '@angular/core';

import {
  round,
  uniqueId
} from 'lodash';
import {
  ChartDefaults,
  SparklineConfig,
  SparklineData
} from 'patternfly-ng';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { Pods } from '../models/pods';
import { ScaledNetworkStat } from '../models/scaled-network-stat';
import { Stat } from '../models/stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import {
  DeploymentsService,
  NetworkStat
} from '../services/deployments.service';

import { DeploymentsLinechartConfig } from '../deployments-linechart/deployments-linechart-config';
import { DeploymentsLinechartData } from '../deployments-linechart/deployments-linechart-data';

enum ChartClass {
  OK = '',
  WARN = 'chart-warn',
  ERR = 'chart-err'
}

enum LabelClass {
  OK = '',
  WARN = 'label-warn',
  ERR = 'label-err'
}

@Component({
  selector: 'deployment-details',
  templateUrl: 'deployment-details.component.html',
  styleUrls: ['./deployment-details.component.less']
})
export class DeploymentDetailsComponent {

  @Input() active: boolean;
  @Input() collapsed: boolean;
  @Input() applicationId: string;
  @Input() environment: Environment;
  @Input() spaceId: string;

  usageMessage: string = '';

  private readonly subscriptions: Array<Subscription> = [];

  cpuData: SparklineData = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['CPU']
  };

  memData: SparklineData = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['Memory']
  };

  netData: DeploymentsLinechartData = {
    xData: ['time'],
    yData: [
      ['sent'],
      ['received']
    ]
  };

  cpuConfig: SparklineConfig = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('cpu-chart'),
    chartHeight: 60,
    axis: {
      type: 'timeseries',
      y: {
        min: 0,
        max: 1,
        padding: 0
      }
    },
    tooltip: this.getTooltipContents(),
    units: 'Cores'
  };

  memConfig: SparklineConfig = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart'),
    chartHeight: 60,
    axis: {
      type: 'timeseries',
      y: {
        min: 0,
        max: 1,
        padding: 0
      }
    },
    tooltip: this.getTooltipContents()
  };

  netConfig: DeploymentsLinechartConfig = {
    chartId: uniqueId('net-chart'),
    units: 'bytes',
    showXAxis: true,
    axis: {
      type: 'timeseries'
    }
  };

  hasPods: Subject<boolean> = new ReplaySubject<boolean>(1);
  cpuStat: Observable<CpuStat[]>;
  memStat: Observable<MemoryStat[]>;
  cpuVal: number;
  cpuMax: number;
  memVal: number;
  memUnits: string;
  memMax: number;
  netVal: number;
  netUnits: string;

  cpuLabelClass: string;
  memLabelClass: string;

  cpuChartClass: string;
  memChartClass: string;

  constructor(
    private deploymentsService: DeploymentsService,
    private deploymentStatusService: DeploymentStatusService,
    private chartDefaults: ChartDefaults
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.deploymentsService.getPods(this.spaceId, this.applicationId, this.environment.name)
        .map((p: Pods) => p.total > 0)
        .subscribe(this.hasPods)
    );

    this.subscriptions.push(
      this.deploymentStatusService.getAggregateStatus(this.spaceId, this.environment.name, this.applicationId)
        .subscribe((status: Status): void => {
          if (status.type === StatusType.OK) {
            this.usageMessage = '';
          } else if (status.type === StatusType.WARN) {
            this.usageMessage = 'Nearing quota';
          } else if (status.type === StatusType.ERR) {
            this.usageMessage = 'Reached quota';
          }
        })
    );

    this.subscriptions.push(
      this.deploymentStatusService.getCpuStatus(this.spaceId, this.environment.name, this.applicationId)
        .subscribe((status: Status): void => {
          if (status.type === StatusType.OK) {
            this.cpuChartClass = '';
            this.cpuLabelClass = '';
          } else if (status.type === StatusType.WARN) {
            this.cpuChartClass = ChartClass.WARN;
            this.cpuLabelClass = LabelClass.WARN;
            this.cpuConfig['color'] = {
              pattern: [
                '#ec7a08' // pf-orange-400
              ]
            };
          } else if (status.type === StatusType.ERR) {
            this.cpuChartClass = ChartClass.ERR;
            this.cpuLabelClass = LabelClass.ERR;
            this.cpuConfig['color'] = {
              pattern: [
                '#cc0000' // pf-red-100
              ]
            };
          }
        })
    );

    this.subscriptions.push(
      this.deploymentStatusService.getMemoryStatus(this.spaceId, this.environment.name, this.applicationId)
        .subscribe((status: Status): void => {
          if (status.type === StatusType.OK) {
            this.memChartClass = '';
            this.memLabelClass = '';
            this.memConfig['color'] = this.chartDefaults.getDefaultSparklineColor();
          } else if (status.type === StatusType.WARN) {
            this.memChartClass = ChartClass.WARN;
            this.memLabelClass = LabelClass.WARN;
            this.memConfig['color'] = {
              pattern: [
                '#ec7a08' // pf-orange-400
              ]
            };
          } else if (status.type === StatusType.ERR) {
            this.memChartClass = ChartClass.ERR;
            this.memLabelClass = LabelClass.ERR;
            this.memConfig['color'] = {
              pattern: [
                '#cc0000' // pf-red-100
              ]
            };
          }
        })
    );

    this.cpuStat =
      this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.applicationId, this.environment.name);

    this.memStat =
      this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.applicationId, this.environment.name);

    this.subscriptions.push(
      this.cpuStat.subscribe((stats: CpuStat[]) => {
        const last: CpuStat = stats[stats.length - 1];
        this.cpuVal = last.used;
        this.cpuMax = last.quota;
        this.cpuData.total = last.quota;
        this.cpuConfig.axis.y.max = this.getChartYAxisMax(stats);
        this.cpuData.xData = [this.cpuData.xData[0], ...stats.map((stat: CpuStat) => stat.timestamp)];
        this.cpuData.yData = [this.cpuData.yData[0], ...stats.map((stat: CpuStat) => stat.used)];
      })
    );

    this.subscriptions.push(
      this.memStat.subscribe((stats: MemoryStat[]) => {
        const last: MemoryStat = stats[stats.length - 1];
        this.memVal = last.used;
        this.memMax = last.quota;
        this.memData.total = last.quota;
        this.memConfig.axis.y.max = this.getChartYAxisMax(stats);
        this.memUnits = last.units;
        this.memData.xData = [this.memData.xData[0], ...stats.map((stat: MemoryStat) => stat.timestamp)];
        this.memData.yData = [this.memData.yData[0], ...stats.map((stat: MemoryStat) => stat.used)];
      })
    );

    this.subscriptions.push(
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.applicationId, this.environment.name).subscribe((stats: NetworkStat[]) => {
        const last: NetworkStat = stats[stats.length - 1];
        const netTotal: ScaledNetworkStat = new ScaledNetworkStat(last.received.raw + last.sent.raw);
        this.netUnits = netTotal.units;
        const decimals = this.netUnits === 'bytes' ? 0 : 1;
        this.netVal = round(netTotal.used, decimals);
        this.netData.xData = [this.netData.xData[0], ...stats.map((stat: NetworkStat) => stat.received.timestamp)];
        this.netData.yData[0] = [this.netData.yData[0][0], ...stats.map((stat: NetworkStat) => round(stat.sent.raw, decimals))];
        this.netData.yData[1] = [this.netData.yData[1][0], ...stats.map((stat: NetworkStat) => round(stat.received.raw, decimals))];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getTooltipContents(): any {
    return {
      contents: (d: any) => {
        // d is an object containing the data displayed for a given data point in the tooltip
        // example: [{ x: Date, value: number, id: string, index: number, name: string }]
        // http://c3js.org/reference.html#tooltip-contents
        let tipRows: string = '';
        let color = '#0088ce'; // pf-blue-400
        let units: string = '';
        if (d[0].name === 'CPU') {
          units = this.cpuConfig.units;
        } else if (d[0].name === 'Memory') {
          units = this.memUnits;
        }
        tipRows += `
          <tr><th colspan="2">${d[0].x.toLocaleString()}</th></tr>
          <tr>
            <td class="name"><span style="background-color: ${color}"></span>${d[0].name}</td>
            <td class="value text-nowrap">${d[0].value} ${units}</td>
          </tr>
        `;
        return this.getTooltipTableHTML(tipRows);
      }
    };
  }

  private getTooltipTableHTML(tipRows: string): string {
    return `
      <div class="module-triangle-bottom">
        <table class="c3-tooltip">
          <tbody>
            ${tipRows}
          </tbody>
        </table>
      </div>
    `;
  }

  private getChartYAxisMax(stats: Stat[]): number {
    const largestUsage: number = stats
      .map((stat: Stat): number => stat.used)
      .reduce((acc: number, next: number): number => Math.max(acc, next));
    const largestQuota: number = stats
      .map((stat: Stat): number => stat.quota)
      .reduce((acc: number, next: number): number => Math.max(acc, next));
    return Math.max(largestUsage, largestQuota);
  }

}
