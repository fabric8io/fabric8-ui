import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Observable,
  Subscription
} from 'rxjs';

import { uniqueId } from 'lodash';

import { CpuStat } from '../models/cpu-stat';
import { Environment } from '../models/environment';
import { MemoryStat } from '../models/memory-stat';
import { DeploymentsService } from '../services/deployments.service';

// Makes patternfly charts available
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  selector: 'deployment-details',
  templateUrl: 'deployment-details.component.html',
  styleUrls: ['./deployment-details.component.less']
})
export class DeploymentDetailsComponent {

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

  public cpuConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('cpu-chart-') + '-'
  };

  public memConfig: any = {
    // Seperate charts must have unique IDs, otherwise only one will appear
    chartId: uniqueId('mem-chart-') + '-'
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

  constructor(private deploymentsService: DeploymentsService) { }

  ngOnInit() {
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
    }));

    this.subscriptions.push(this.memStat.subscribe(stat => {
      this.memVal = stat.used;
      this.memMax = stat.quota;
      this.memData.yData.push(stat.used);
      this.memData.xData.push(this.cpuTime++);
      this.memUnits = stat.units;
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}
