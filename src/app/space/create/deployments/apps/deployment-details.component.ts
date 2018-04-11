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
} from 'patternfly-ng/chart';
import 'patternfly/dist/js/patternfly-settings.js';
import {
  Observable,
  ReplaySubject,
  Subject,
  Subscription
} from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import { MemoryStat } from '../models/memory-stat';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledNetStat } from '../models/scaled-net-stat';
import {
  instanceOfScaledStat,
  ScaledStat
} from '../models/scaled-stat';
import { Stat } from '../models/stat';
import {
  DeploymentStatusService,
  Status,
  StatusType
} from '../services/deployment-status.service';
import { DeploymentsService } from '../services/deployments.service';

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
  @Input() environment: string;
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
  memMax: number;
  memUnits: string = 'MB';
  netVal: number;
  netUnits: string = 'bytes';

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
      this.deploymentsService.getPods(this.spaceId, this.environment, this.applicationId)
        .map((p: Pods) => p.total > 0)
        .subscribe(this.hasPods)
    );

    this.subscriptions.push(
      this.deploymentStatusService.getAggregateStatus(this.spaceId, this.environment, this.applicationId)
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
      this.deploymentStatusService.getCpuStatus(this.spaceId, this.environment, this.applicationId)
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
      this.deploymentStatusService.getMemoryStatus(this.spaceId, this.environment, this.applicationId)
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
      this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.environment, this.applicationId);

    this.memStat =
      this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.environment, this.applicationId);

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
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.environment, this.applicationId).subscribe((stats: NetworkStat[]) => {
        const last: NetworkStat = stats[stats.length - 1];
        const netTotal: ScaledNetStat = new ScaledNetStat(this.getNetStatValue(last).sent + this.getNetStatValue(last).received);
        const decimals: number = netTotal.units === 'bytes' ? 0 : 1;
        this.netUnits = netTotal.units;
        this.netVal = round(netTotal.used, decimals);
        this.netData.xData = [this.netData.xData[0], ...stats.map((stat: NetworkStat) => stat.received.timestamp)];
        this.netData.yData[0] = [this.netData.yData[0][0], ...stats.map((stat: NetworkStat) => round(this.getNetStatValue(stat).sent, decimals))];
        this.netData.yData[1] = [this.netData.yData[1][0], ...stats.map((stat: NetworkStat) => round(this.getNetStatValue(stat).received, decimals))];
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

  private getNetStatValue(stat: NetworkStat): { sent: number, received: number } {
    let sent: number = stat.sent.used;
    let received: number = stat.received.used;
    if (instanceOfScaledStat(stat.sent) && instanceOfScaledStat(stat.received)) {
      sent = stat.sent.raw;
      received = stat.received.raw;
    }
    return { sent, received };
  }

}
