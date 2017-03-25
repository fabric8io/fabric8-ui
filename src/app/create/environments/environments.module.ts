import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ToolbarModule, TreeListModule } from 'ngx-widgets';
import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig
} from 'ng2-bootstrap';

import { TreeModule } from 'angular2-tree-component';

import {
  DeploymentModule,
} from 'fabric8-runtime-console';

import { EnvironmentsComponent } from './environments.component';
import { EnvironmentsRoutingModule } from './environments-routing.module';


@NgModule({
  imports: [
    CommonModule,
    EnvironmentsRoutingModule,
    HttpModule,
    ToolbarModule,
    DropdownModule,
    TreeListModule,
    TreeModule,
    DeploymentModule
  ],
  declarations: [EnvironmentsComponent],
  providers: [
    ComponentLoaderFactory,
    DropdownConfig,
    PositioningService,
    TooltipConfig
  ]
})
export class EnvironmentsModule {
  constructor(http: Http) { }
}
