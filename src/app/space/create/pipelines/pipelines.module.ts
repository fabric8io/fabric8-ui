import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ToolbarModule } from 'patternfly-ng/toolbar';


import { PipelineModule } from 'a-runtime-console/index';
import { FeatureFlagModule } from '../../../feature-flag/feature-flag.module';
import { PipelinesRoutingModule } from './pipelines-routing.module';
import { PipelinesComponent } from './pipelines.component';
import { PipelinesService } from './services/pipelines.service';


@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    PipelinesRoutingModule,
    PipelineModule,
    ToolbarModule,
    FeatureFlagModule,
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
