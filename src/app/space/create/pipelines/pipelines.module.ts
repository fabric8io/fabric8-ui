import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ToolbarModule } from 'patternfly-ng';

import {
  PipelineModule
} from '../../../../a-runtime-console/index';

import { PipelinesComponent } from './pipelines.component';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { ForgeWizardModule } from '../../forge-wizard/forge-wizard.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    PipelinesRoutingModule,
    PipelineModule,
    ToolbarModule,
    ForgeWizardModule,
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [PipelinesComponent],
  providers: [
    BsDropdownConfig,
    TooltipConfig
  ]
})
export class PipelinesModule {
  constructor(http: Http) { }
}
