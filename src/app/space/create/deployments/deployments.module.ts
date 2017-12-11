import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DeploymentsComponent } from '../deployments/deployments.component';
import { DeploymentsAppsComponent } from '../deployments/apps/deployments-apps.component';
import { CollapsibleDeploymentInfoComponent } from '../deployments/apps/collapsible-deployment-info.component';
import { DeploymentsResourceUsageComponent } from '../deployments/resource-usage/deployments-resource-usage.component';
import { DeploymentCardContainerComponent } from '../deployments/apps/deployment-card-container.component';
import { DeploymentCardComponent } from '../deployments/apps/deployment-card.component';
import { DeploymentGraphLabelComponent } from '../deployments/apps/deployment-graph-label.component';
import { DeploymentsDonutComponent } from './deployments-donut/deployments-donut.component';
import {
  DeploymentsDonutChartComponent
} from './deployments-donut/deployments-donut-chart/deployments-donut-chart.component';
import { ResourceCardComponent } from '../deployments/resource-usage/resource-card.component';
import { UtilizationBarComponent } from '../deployments/resource-usage/utilization-bar.component';

import { DeploymentsRoutingModule } from './deployments-routing.module';

import { DeploymentsService } from '../deployments/services/deployments.service';

import { ChartModule } from 'patternfly-ng';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CommonModule,
    ChartModule,
    DeploymentsRoutingModule
  ],
  declarations: [
    DeploymentsComponent,
    DeploymentCardContainerComponent,
    DeploymentCardComponent,
    DeploymentGraphLabelComponent,
    DeploymentsAppsComponent,
    CollapsibleDeploymentInfoComponent,
    DeploymentsResourceUsageComponent,
    DeploymentsDonutComponent,
    DeploymentsDonutChartComponent,
    ResourceCardComponent,
    UtilizationBarComponent
  ],
  providers: [
    BsDropdownConfig,
    DeploymentsService
  ]
})
export class DeploymentsModule {
  constructor(http: Http) { }
}
