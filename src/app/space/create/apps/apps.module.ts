import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { AppModule as RuntimeConsoleModule } from '../../../../a-runtime-console/index';

import { AppsComponent } from './apps.component';
import { DeploymentCardComponent } from './components/deployment-card/deployment-card.component';
import { ResourceCardComponent } from './components/resource-card.component';
import { AppsRoutingModule } from './apps-routing.module';

import { DeploymentsService } from './services/deployments.service';

const USE_RUNTIME_CONSOLE = ENV !== 'development';

const imports = USE_RUNTIME_CONSOLE ?
  [CommonModule, RuntimeConsoleModule] :
  [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    CommonModule,
    AppsRoutingModule
  ];

const declarations = USE_RUNTIME_CONSOLE ?
  [] :
  [AppsComponent, DeploymentCardComponent, ResourceCardComponent];

const providers = USE_RUNTIME_CONSOLE ?
  [] :
  [BsDropdownConfig, DeploymentsService];

@NgModule({
  imports: imports,
  declarations: declarations,
  providers: providers
})
export class AppsModule {
  constructor(http: Http) { }
}
