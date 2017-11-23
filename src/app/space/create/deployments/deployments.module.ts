import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { DeploymentsComponent } from '../deployments/deployments.component';
import { DeploymentCardComponent } from '../deployments/components/deployment-card/deployment-card.component';
import { ResourceCardComponent } from '../deployments/components/resource-card.component';
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
    DeploymentCardComponent,
    ResourceCardComponent
  ],
  providers: [
    BsDropdownConfig,
    DeploymentsService
  ]
})
export class DeploymentsModule {
  constructor(http: Http) { }
}
