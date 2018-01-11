import { Component, Input } from '@angular/core';

import {
  round,
  uniqueId
} from 'lodash';
import 'patternfly/dist/js/patternfly-settings.js';
import { Observable, Subscription } from 'rxjs';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
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

  @Input() collapsed: boolean;
  @Input() applicationId: string;
  @Input() environment: Environment;
  @Input() spaceId: string;

  subscriptions: Array<Subscription> = [];

  public cpuData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 0],
    yData: ['used', 1]
  };

  public memData: any = {
    dataAvailable: true,
    total: 100,
    xData: ['time', 0],
    yData: ['used', 1]
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
    chartId: uniqueId('cpu-chart-') + '-'
  };

  public memConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart-') + '-'
  };

  public netConfig: DeploymentsLinechartConfig = {
    chartId: uniqueId('network'),
    showXAxis: true
  };

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

  sparklineMaxElements: number;

  constructor(private deploymentsService: DeploymentsService) { }

  ngOnInit() {
    this.setChartMaxElements(
      DeploymentDetailsComponent.DEFAULT_SPARKLINE_DATA_DURATION / DeploymentsService.POLL_RATE_MS);

    this.cpuConfig.chartHeight = 100;
    this.memConfig.chartHeight = 100;
    this.cpuTime = 1;
    this.memTime = 1;

    this.cpuStat =
      this.deploymentsService.getCpuStat(this.applicationId, this.environment.name);

    this.memStat =
      this.deploymentsService.getMemoryStat(this.applicationId, this.environment.name);

    this.subscriptions.push(this.cpuStat.subscribe(stat => {
      this.cpuVal = stat.used;
      this.cpuMax = stat.quota;
      this.cpuData.yData.push(stat.used);
      this.cpuData.xData.push(this.cpuTime++);
      this.trimSparklineData(this.cpuData);
    }));

    this.subscriptions.push(this.memStat.subscribe(stat => {
      this.memVal = stat.used;
      this.memMax = stat.quota;
      this.memData.yData.push(stat.used);
      this.memData.xData.push(this.cpuTime++);
      this.memUnits = stat.units;
      this.trimSparklineData(this.memData);
    }));

    this.subscriptions.push(
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.applicationId, this.environment.name)
        .subscribe(stat => {
          this.netVal = round(stat.received + stat.sent, 1);
          this.netData.xData.push(+new Date());
          this.netData.yData[0].push(stat.sent);
          this.netData.yData[1].push(stat.received);
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
