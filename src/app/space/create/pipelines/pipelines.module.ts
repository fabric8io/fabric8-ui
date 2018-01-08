import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToolbarModule } from 'patternfly-ng';


import { PipelineModule } from 'a-runtime-console/index';
import { ForgeWizardModule } from '../../forge-wizard/forge-wizard.module';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { PipelinesComponent } from './pipelines.component';

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
