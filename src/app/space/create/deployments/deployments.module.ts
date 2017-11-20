import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { DeploymentsComponent } from '../deployments/deployments.component';
import { DeploymentCardComponent } from '../deployments/components/deployment-card/deployment-card.component';
import { ResourceCardComponent } from '../deployments/components/resource-card.component';
import { DeploymentsRoutingModule } from './deployments-routing.module';

import { DeploymentsService } from '../deployments/services/deployments.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    CommonModule,
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
