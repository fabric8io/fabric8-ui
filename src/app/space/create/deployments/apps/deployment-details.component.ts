import {
  Component,
  Input
} from '@angular/core';

import { ChartAPI } from 'c3';
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
import {
  fromOrdinal,
  MemoryUnit,
  ordinal
} from '../models/memory-unit';
import { NetworkStat } from '../models/network-stat';
import { Pods } from '../models/pods';
import { ScaledMemoryStat } from '../models/scaled-memory-stat';
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
      type: 'timeseries'
    },
    tooltip: this.getTooltipContents(),
    units: 'Cores'
  };

  memConfig: SparklineConfig = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart'),
    chartHeight: 60,
    axis: {
      type: 'timeseries'
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

  private cpuChart: ChartAPI;
  private memChart: ChartAPI;
  private netChart: ChartAPI;

  private cpuChartLoad: Subject<void> = new ReplaySubject<void>();
  private memChartLoad: Subject<void> = new ReplaySubject<void>();
  private netChartLoad: Subject<void> = new ReplaySubject<void>();

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
        .skipUntil(this.cpuChartLoad)
        .subscribe((status: Status): void => {
          let color: string;
          if (status.type === StatusType.OK) {
            this.cpuChartClass = '';
            this.cpuLabelClass = '';
            color = '#0088ce'; // pf-blue
          } else if (status.type === StatusType.WARN) {
            this.cpuChartClass = ChartClass.WARN;
            this.cpuLabelClass = LabelClass.WARN;
            color = '#ec7a08'; // pf-orange-400
          } else if (status.type === StatusType.ERR) {
            this.cpuChartClass = ChartClass.ERR;
            this.cpuLabelClass = LabelClass.ERR;
            color = '#cc0000'; // pf-red-100
          }
          this.cpuChart.data.colors({ CPU: color });
          this.cpuChart.flush();
        })
    );

    this.subscriptions.push(
      this.deploymentStatusService.getMemoryStatus(this.spaceId, this.environment, this.applicationId)
        .skipUntil(this.memChartLoad)
        .subscribe((status: Status): void => {
          let color: string;
          if (status.type === StatusType.OK) {
            this.memChartClass = '';
            this.memLabelClass = '';
            color = '#0088ce'; // pf-blue
          } else if (status.type === StatusType.WARN) {
            this.memChartClass = ChartClass.WARN;
            this.memLabelClass = LabelClass.WARN;
            color = '#ec7a08'; // pf-orange-400
          } else if (status.type === StatusType.ERR) {
            this.memChartClass = ChartClass.ERR;
            this.memLabelClass = LabelClass.ERR;
            color = '#cc0000'; // pf-red-100
          }
          this.memChart.data.colors({ Memory: color });
          this.memChart.flush();
        })
    );

    this.cpuStat =
      this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.environment, this.applicationId);

    this.memStat =
      this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.environment, this.applicationId);

    this.subscriptions.push(
      this.cpuStat
        .skipUntil(this.cpuChartLoad)
        .subscribe((stats: CpuStat[]) => {
          const last: CpuStat = stats[stats.length - 1];
          this.cpuVal = last.used;
          this.cpuMax = last.quota;
          this.cpuData.total = last.quota;
          this.cpuData.xData = [this.cpuData.xData[0], ...stats.map((stat: CpuStat) => stat.timestamp)];
          this.cpuData.yData = [this.cpuData.yData[0], ...stats.map((stat: CpuStat) => stat.used)];
          this.cpuChart.axis.max({ y: this.getChartYAxisMax(stats) });
          this.cpuChart.flush();
        })
    );

    this.subscriptions.push(
      this.memStat
        .skipUntil(this.memChartLoad)
        .subscribe((stats: MemoryStat[]) => {
          const last: MemoryStat = stats[stats.length - 1];
          this.memVal = last.used;
          this.memMax = last.quota;
          this.memData.total = last.quota;
          this.memUnits = last.units;
          this.memData.xData = [this.memData.xData[0], ...stats.map((stat: MemoryStat) => stat.timestamp)];
          this.memData.yData = [this.memData.yData[0], ...stats.map((stat: MemoryStat) => stat.used)];
          this.memChart.axis.max({ y: this.getChartYAxisMax(stats) });
          this.memChart.flush();
        })
    );

    this.subscriptions.push(
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.environment, this.applicationId)
        .skipUntil(this.netChartLoad)
        .subscribe((stats: NetworkStat[]) => {
          const last: NetworkStat = stats[stats.length - 1];
          this.netUnits = fromOrdinal(Math.max(ordinal(last.sent.units), ordinal(last.received.units)));
          this.netConfig.units = this.netUnits;
          const decimals: number = this.netUnits === 'bytes' ? 0 : 1;
          this.netVal = round(last.sent.used + last.received.used, decimals);
          this.netData.xData = [this.netData.xData[0], ...stats.map((stat: NetworkStat) => stat.received.timestamp)];
          this.netData.yData[0] = [this.netData.yData[0][0], ...stats.map((stat: NetworkStat) => round(stat.sent.used, decimals))];
          this.netData.yData[1] = [this.netData.yData[1][0], ...stats.map((stat: NetworkStat) => round(stat.received.used, decimals))];
          this.netChart.flush();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());

    if (this.cpuChart) {
      this.cpuChart.destroy();
    }
    if (this.memChart) {
      this.memChart.destroy();
    }
    if (this.netChart) {
      this.netChart.destroy();
    }
  }

  cpuChartLoaded(cpuChart: ChartAPI): void {
    this.cpuChart = cpuChart;
    this.cpuChartLoad.next();
    this.cpuChartLoad.complete();
  }

  memChartLoaded(memChart: ChartAPI): void {
    this.memChart = memChart;
    this.memChartLoad.next();
    this.memChartLoad.complete();
  }

  netChartLoaded(netChart: ChartAPI): void {
    this.netChart = netChart;
    this.netChartLoad.next();
    this.netChartLoad.complete();
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
