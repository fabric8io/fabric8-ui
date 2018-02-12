import { Component, Input } from '@angular/core';

import {
  round,
  uniqueId
} from 'lodash';
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
import { DeploymentsService } from '../services/deployments.service';

import { DeploymentsLinechartConfig } from '../deployments-linechart/deployments-linechart-config';
import { DeploymentsLinechartData } from '../deployments-linechart/deployments-linechart-data';

@Component({
  selector: 'deployment-details',
  templateUrl: 'deployment-details.component.html',
  styleUrls: ['./deployment-details.component.less']
})
export class DeploymentDetailsComponent {

  public static readonly DEFAULT_SPARKLINE_DATA_DURATION: number = 15 * 60 * 1000;

  @Input() active: boolean;
  @Input() collapsed: boolean;
  @Input() applicationId: string;
  @Input() environment: Environment;
  @Input() spaceId: string;

  subscriptions: Array<Subscription> = [];

  public cpuData: any = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['used']
  };

  public memData: any = {
    dataAvailable: true,
    xData: ['time'],
    yData: ['used']
  };

  public netData: DeploymentsLinechartData = {
    xData: ['time'],
    yData: [
      ['sent'],
      ['received']
    ]
  };

  public cpuConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('cpu-chart')
  };

  public memConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart')
  };

  public netConfig: DeploymentsLinechartConfig = {
    chartId: uniqueId('net-chart'),
    units: 'bytes',
    showXAxis: true
  };

  hasPods: Subject<boolean> = new ReplaySubject<boolean>(1);
  cpuStat: Observable<CpuStat>;
  memStat: Observable<MemoryStat>;
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

  ngOnInit() {
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

    this.cpuStat =
      this.deploymentsService.getDeploymentCpuStat(this.spaceId, this.applicationId, this.environment.name);

    this.memStat =
      this.deploymentsService.getDeploymentMemoryStat(this.spaceId, this.applicationId, this.environment.name);

    this.subscriptions.push(this.cpuStat.subscribe(stat => {
      this.cpuVal = stat.used;
      this.cpuMax = stat.quota;
      this.cpuData.total = stat.quota;
      this.cpuData.yData.push(stat.used);
      this.cpuData.xData.push(this.cpuTime++);
      this.trimSparklineData(this.cpuData);
    }));

    this.subscriptions.push(this.memStat.subscribe(stat => {
      this.memVal = stat.used;
      this.memMax = stat.quota;
      this.memData.total = stat.quota;
      this.memData.yData.push(stat.used);
      this.memData.xData.push(this.cpuTime++);
      this.memUnits = stat.units;
      this.trimSparklineData(this.memData);
    }));

    this.subscriptions.push(
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.applicationId, this.environment.name)
        .subscribe(stat => {
          const netTotal: ScaledNetworkStat = new ScaledNetworkStat(stat.received.raw + stat.sent.raw);
          this.netVal = round(netTotal.used, 1);
          this.netUnits = netTotal.units;
          this.netData.xData.push(+new Date());
          this.netData.yData[0].push(stat.sent.raw);
          this.netData.yData[1].push(stat.received.raw);
          this.trimLinechartData(this.netData);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private trimSparklineData(chartData: any): void {
    if (chartData.xData.length > this.sparklineMaxElements) {
      let elementsToRemoveCount = chartData.xData.length - this.sparklineMaxElements;
      chartData.xData.splice(1, elementsToRemoveCount);
      chartData.yData.splice(1, elementsToRemoveCount);
    }
  }

  private trimLinechartData(chartData: any): void {
    if (chartData.xData.length > this.sparklineMaxElements) {
      let elementsToRemoveCount = chartData.xData.length - this.sparklineMaxElements;
      chartData.xData.splice(1, elementsToRemoveCount);
      chartData.yData.forEach(yData => {
        yData.splice(1, elementsToRemoveCount);
      });
    }
  }

  public getChartMaxElements(): number {
    return this.sparklineMaxElements;
  }

  public setChartMaxElements(maxElements: number): void {
    this.sparklineMaxElements = Math.max(1, maxElements);
  }
}
