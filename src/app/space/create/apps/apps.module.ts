import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { useRuntimeConsole } from '../config/use-runtime-console';

import { AppModule as RuntimeConsoleModule } from '../../../../a-runtime-console/index';

import { AppsComponent } from './apps.component';
import { DeploymentCardComponent } from './components/deployment-card/deployment-card.component';
import { AppsRoutingModule } from './apps-routing.module';

import { AppsService } from './services/apps.service';

const imports = useRuntimeConsole() ?
  [CommonModule, RuntimeConsoleModule] :
  [
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    AccordionModule.forRoot(),
    CommonModule,
    AppsRoutingModule
  ];

const declarations = useRuntimeConsole() ?
  [] :
  [AppsComponent, DeploymentCardComponent];

const providers = useRuntimeConsole() ?
  [] :
  [BsDropdownConfig, AppsService];

@NgModule({
  imports: imports,
  declarations: declarations,
  providers: providers
})
export class AppsModule {
  constructor(http: Http) { }
}
