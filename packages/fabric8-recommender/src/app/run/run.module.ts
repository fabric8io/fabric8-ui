import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { RunComponent }     from './run.component';
import { RunRoutingModule } from './run-routing.module';

import { PipelinesModule } from './pipelines/pipelines.module';


@NgModule({
  imports:      [ PipelinesModule, CommonModule, RunRoutingModule, HttpModule ],
  declarations: [ RunComponent ],
})
export class RunModule {
  constructor(http: Http) {}
}