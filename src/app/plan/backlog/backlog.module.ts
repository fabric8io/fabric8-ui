import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { CollapseDirective } from 'ng2-bootstrap/ng2-bootstrap';
import { PlannerListModule } from 'fabric8-planner';

import { BacklogComponent }     from './backlog.component';
import { BacklogRoutingModule } from './backlog-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BacklogRoutingModule,
    HttpModule,
    PlannerListModule
  ],
  declarations: [ BacklogComponent, /*CollapseDirective*/ ],
})
export class BacklogModule {
  constructor(http: Http) {}
}
