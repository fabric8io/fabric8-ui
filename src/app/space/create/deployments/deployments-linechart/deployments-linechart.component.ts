import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';

import { uniqueId } from 'lodash';

import { DeploymentsService } from '../services/deployments.service';

import { Environment } from '../models/environment';

import { LinechartConfig } from './linechart-component/linechart-config';
import { LinechartData } from './linechart-component/linechart-data';

@Component({
  selector: 'deployments-linechart',
  templateUrl: './deployments-linechart.component.html'
})
export class DeploymentsLinechartComponent implements OnInit, OnDestroy {

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  private subscriptions: Subscription[] = [];

  private sent: number;
  private received: number;

  private chartData: LinechartData = {
    xData: ['time'],
    yData: [
      ['sent'],
      ['received']
    ]
  };
  private config: LinechartConfig = {
    chartId: uniqueId('network'),
    showXAxis: true
  };

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(
      this.deploymentsService.getDeploymentNetworkStat(this.spaceId, this.applicationId, this.environment.name)
        .subscribe(stat => {
          this.chartData.xData.push(+new Date());
          this.chartData.yData[0].push(stat.sent);
          this.chartData.yData[1].push(stat.received);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}
