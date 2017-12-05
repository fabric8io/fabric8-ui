import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs';

import { DeploymentsService } from '../services/deployments.service';
import { Environment } from '../models/environment';

// Makes patternfly charts available
import 'patternfly/dist/js/patternfly-settings.js';

@Component({
  selector: 'deployment-card',
  templateUrl: 'deployment-card.component.html'
})
export class DeploymentCardComponent implements OnDestroy, OnInit {

  static chartIdNum = 1;

  @Input() spaceId: string;
  @Input() applicationId: string;
  @Input() environment: Environment;

  public data: any = {
    dataAvailable: true,
    total: 100,
    xData: ['foo', 1, 2, 3, 4],
    yData: ['used', 10, 20, 30, 40]
  };

  public config: any = {
    // Seperate chart IDs must be unique, otherwise only one will appear
    chartId: 'chart-' + DeploymentCardComponent.chartIdNum++ + '-'
  };

  collapsed: boolean = true;
  version: Observable<string>;

  constructor(
    private deploymentsService: DeploymentsService
  ) { }

  getChartIdNum(): number {
    return DeploymentCardComponent.chartIdNum;
  }
  ngOnDestroy(): void { }

  ngOnInit(): void {

    this.config.chartHeight = 60;

    this.version =
      this.deploymentsService.getVersion(this.applicationId, this.environment.environmentId);
  }

}
