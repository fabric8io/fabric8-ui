import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChartModule, ToolbarModule } from 'patternfly-ng';

import { DeploymentCardContainerComponent } from './apps/deployment-card-container.component';
import { DeploymentCardComponent } from './apps/deployment-card.component';
import { DeploymentDetailsComponent } from './apps/deployment-details.component';
import { DeploymentGraphLabelComponent } from './apps/deployment-graph-label.component';
import { DeploymentsAppsComponent } from './apps/deployments-apps.component';
import { DeploymentsDonutChartComponent } from './deployments-donut/deployments-donut-chart/deployments-donut-chart.component';
import { DeploymentStatusIconComponent } from '../deployments/apps/deployment-status-icon.component';
import { DeploymentsDonutComponent } from './deployments-donut/deployments-donut.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';
import { DeploymentsToolbarComponent } from './deployments-toolbar/deployments-toolbar.component';
import { DeploymentsComponent } from './deployments.component';
import { DeploymentsResourceUsageComponent } from './resource-usage/deployments-resource-usage.component';
import { ResourceCardComponent } from './resource-usage/resource-card.component';
import { UtilizationBarComponent } from './resource-usage/utilization-bar.component';
import { DeploymentsService } from './services/deployments.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CommonModule,
    ChartModule,
    DeploymentsRoutingModule,
    ToolbarModule
  ],
  declarations: [
    DeploymentsComponent,
    DeploymentCardContainerComponent,
    DeploymentCardComponent,
    DeploymentGraphLabelComponent,
    DeploymentStatusIconComponent,
    DeploymentsAppsComponent,
    DeploymentDetailsComponent,
    DeploymentsResourceUsageComponent,
    DeploymentsDonutComponent,
    DeploymentsDonutChartComponent,
    DeploymentsToolbarComponent,
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
