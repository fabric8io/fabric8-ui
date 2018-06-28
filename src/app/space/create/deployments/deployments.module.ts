import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { SparklineChartModule } from 'patternfly-ng/chart';
import { ToolbarModule } from 'patternfly-ng/toolbar';

import { DeleteDeploymentModal } from './apps/delete-deployment-modal.component';
import { DeploymentCardContainerComponent } from './apps/deployment-card-container.component';
import { DeploymentCardComponent } from './apps/deployment-card.component';
import { DeploymentDetailsComponent } from './apps/deployment-details.component';
import { DeploymentGraphLabelComponent } from './apps/deployment-graph-label.component';
import { DeploymentStatusIconComponent } from './apps/deployment-status-icon.component';
import { DeploymentsAppsComponent } from './apps/deployments-apps.component';
import { DeploymentsDonutChartComponent } from './deployments-donut/deployments-donut-chart/deployments-donut-chart.component';
import { DeploymentsDonutComponent } from './deployments-donut/deployments-donut.component';
import { DeploymentsLinechartComponent } from './deployments-linechart/deployments-linechart.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';
import { DeploymentsToolbarComponent } from './deployments-toolbar/deployments-toolbar.component';
import { DeploymentsComponent } from './deployments.component';
import { DeploymentsResourceUsageComponent } from './resource-usage/deployments-resource-usage.component';
import { LoadingUtilizationBarComponent } from './resource-usage/loading-utilization-bar.component';
import { ResourceCardComponent } from './resource-usage/resource-card.component';
import { UtilizationBarComponent } from './resource-usage/utilization-bar.component';
import { DeploymentApiService } from './services/deployment-api.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CommonModule,
    DeploymentsRoutingModule,
    ModalModule.forRoot(),
    SparklineChartModule,
    ToolbarModule
  ],
  declarations: [
    DeleteDeploymentModal,
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
    DeploymentsLinechartComponent,
    DeploymentsToolbarComponent,
    LoadingUtilizationBarComponent,
    ResourceCardComponent,
    UtilizationBarComponent
  ],
  providers: [
    BsDropdownConfig,
    DeploymentApiService
  ]
})
export class DeploymentsModule {
  constructor() { }
}
