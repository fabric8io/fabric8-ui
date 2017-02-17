import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PlanComponent }     from './plan.component';
import { PlanRoutingModule } from './plan-routing.module';

import { BacklogModule } from './backlog/backlog.module';


@NgModule({
  imports:      [ BacklogModule, CommonModule, PlanRoutingModule, HttpModule ],
  declarations: [ PlanComponent ],
})
export class PlanModule {
  constructor(http: Http) {}
}