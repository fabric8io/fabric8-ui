import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ChartModule } from 'patternfly-ng/chart';
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
import {
  DeploymentsService,
  TIMER_TOKEN,
  TIMESERIES_SAMPLES_TOKEN
} from './services/deployments.service';

const DEPLOYMENTS_SERVICE_POLL_TIMER = Observable
  .timer(DeploymentsService.INITIAL_UPDATE_DELAY, DeploymentsService.POLL_RATE_MS)
  .share();

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    CommonModule,
    ChartModule,
    DeploymentsRoutingModule,
    ModalModule.forRoot(),
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
    { provide: TIMER_TOKEN, useValue: DEPLOYMENTS_SERVICE_POLL_TIMER },
    { provide: TIMESERIES_SAMPLES_TOKEN, useValue: 15 }
  ]
})
export class DeploymentsModule {
  constructor(http: Http) { }
}
