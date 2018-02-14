import {
  Component,
  Input
} from '@angular/core';

import {
  round,
  uniqueId
} from 'lodash';
import {
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
import {
  DeploymentsService,
  NetworkStat,
  TimeConstrainedStats,
  TimestampedCpuStats,
  TimestampedMemoryStats,
  TimestampedNetworkStats
} from '../services/deployments.service';

import { DeploymentsLinechartConfig } from '../deployments-linechart/deployments-linechart-config';
import { DeploymentsLinechartData } from '../deployments-linechart/deployments-linechart-data';

@Component({
  selector: 'deployment-details',
  templateUrl: 'deployment-details.component.html',
  styleUrls: ['./deployment-details.component.less']
})
export class DeploymentDetailsComponent {

  static readonly DEFAULT_SPARKLINE_DATA_DURATION: number = 15 * 60 * 1000;

  @Input() active: boolean;
  @Input() collapsed: boolean;
  @Input() applicationId: string;
  @Input() environment: Environment;
  @Input() spaceId: string;

  subscriptions: Array<Subscription> = [];

  cpuData: SparklineData = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['used']
  };

  memData: SparklineData = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['used']
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
    chartId: uniqueId('cpu-chart')
  };

  memConfig: SparklineConfig = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart')
  };

  netConfig: DeploymentsLinechartConfig = {
    chartId: uniqueId('net-chart'),
    units: 'bytes',
    showXAxis: true
  };

  hasPods: Subject<boolean> = new ReplaySubject<boolean>(1);
  cpuStat: Observable<CpuStat>;
  memStat: Observable<MemoryStat>;
  initialChartStats: Observable<TimeConstrainedStats>;
  cpuTime: number;
  memTime: number;
  cpuVal: number;
  cpuMax: number;
  memVal: number;
  memUnits: string;
  memMax: number;
  netVal: number;
  netUnits: string;

  sparklineMaxElements: number;

  constructor(private deploymentsService: DeploymentsService) { }

  ngOnInit(): void {
    this.setChartMaxElements(
      DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION / DeploymentsService.POLL_RATE_MS);

    this.subscriptions.push(
      this.deploymentsService.getPods(this.spaceId, this.applicationId, this.environment.name)
        .map((p: Pods) => p.total > 0)
        .subscribe(this.hasPods)
    );

    this.cpuConfig.chartHeight = 60;
    this.memConfig.chartHeight = 60;
    this.cpuTime = 1;
    this.memTime = 1;

    this.initialChartStats =
      this.deploymentsService.getDeploymentTimeConstrainedStats(this.spaceId, this.applicationId, this.environment.name, DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION)
        .first();

    this.cpuStat =
      this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.applicationId, this.environment.name);

    this.memStat =
      this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.applicationId, this.environment.name);

    this.processTimeConstrainedStats(this.initialChartStats)
      .subscribe(() => {
        this.subscriptions.push(this.cpuStat.subscribe((stat: CpuStat) => {
          this.cpuVal = stat.used;
          this.cpuMax = stat.quota;
          this.cpuData.total = stat.quota;
          this.cpuData.yData.push(stat.used);
          this.cpuData.xData.push(this.cpuTime++);
          this.trimSparklineData(this.cpuData);
        }));

        this.subscriptions.push(this.memStat.subscribe((stat: MemoryStat) => {
          this.memVal = stat.used;
          this.memMax = stat.quota;
          this.memData.total = stat.quota;
          this.memData.yData.push(stat.used);
          this.memData.xData.push(this.memTime++);
          this.memUnits = stat.units;
          this.trimSparklineData(this.memData);
        }));

        this.subscriptions.push(
          this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.applicationId, this.environment.name)
            .subscribe((stat: NetworkStat) => {
              const netTotal: ScaledNetworkStat = new ScaledNetworkStat(stat.received.raw + stat.sent.raw);
              this.netUnits = netTotal.units;
              const decimals = this.netUnits === 'bytes' ? 0 : 1;
              this.netVal = round(netTotal.used, decimals);
              const sent = round(stat.sent.raw, decimals);
              const received = round(stat.received.raw, decimals);
              this.netData.xData.push(+new Date());
              this.netData.yData[0].push(sent);
              this.netData.yData[1].push(received);
              this.trimLinechartData(this.netData);
            })
        );
      });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getChartMaxElements(): number {
    return this.sparklineMaxElements;
  }

  setChartMaxElements(maxElements: number): void {
    this.sparklineMaxElements = Math.max(1, maxElements);
  }

  private trimSparklineData(chartData: SparklineData): void {
    if (chartData.xData.length > this.sparklineMaxElements) {
      let elementsToRemoveCount = chartData.xData.length - this.sparklineMaxElements;
      chartData.xData.splice(1, elementsToRemoveCount);
      chartData.yData.splice(1, elementsToRemoveCount);
    }
  }

  private trimLinechartData(chartData: SparklineData): void {
    if (chartData.xData.length > this.sparklineMaxElements) {
      let elementsToRemoveCount = chartData.xData.length - this.sparklineMaxElements;
      chartData.xData.splice(1, elementsToRemoveCount);
      chartData.yData.forEach(yData => {
        yData.splice(1, elementsToRemoveCount);
      });
    }
  }

  private processTimeConstrainedStats(stats: Observable<TimeConstrainedStats>): Observable<void> {
    const latch: Subject<void> = new Subject<void>();
    this.subscriptions.push(
      stats.subscribe((s: TimeConstrainedStats) => {
        s.cpu.forEach((e: TimestampedCpuStats) => {
          this.cpuVal = e.data.used;
          this.cpuMax = e.data.quota;
          this.cpuData.total = e.data.quota;
          this.cpuData.yData.push(e.data.used);
          this.cpuData.xData.push(this.cpuTime++);
        });
        s.memory.forEach((e: TimestampedMemoryStats) => {
          this.memVal = e.data.used;
          this.memMax = e.data.quota;
          this.memUnits = e.data.units;
          this.memData.total = e.data.quota;
          this.memData.yData.push(e.data.used);
          this.memData.xData.push(this.memTime++);
        });
        s.network.forEach((e: TimestampedNetworkStats) => {
          const netTotal: ScaledNetworkStat = new ScaledNetworkStat(e.data.received.raw + e.data.sent.raw);
          this.netUnits = netTotal.units;
          const decimals = this.netUnits === 'bytes' ? 0 : 1;
          this.netVal = round(netTotal.used, decimals);
          const sent = round(e.data.sent.raw, decimals);
          const received = round(e.data.received.raw, decimals);
          this.netData.xData.push(e.timestamp);
          this.netData.yData[0].push(sent);
          this.netData.yData[1].push(received);
        });
      }, (error: any) => {}, () => { latch.next(); latch.complete(); })
    );
    return latch;
  }
}
