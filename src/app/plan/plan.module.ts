import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { WorkItemModule } from 'fabric8-planner';

import { PlanRoutingModule } from './plan-routing.module';


@NgModule({
  imports:      [ CommonModule, PlanRoutingModule, WorkItemModule ],
  declarations: []
})
export class PlanModule {
  constructor(http: Http) {}
}
