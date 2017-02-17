import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { PipelinesComponent }     from './pipelines.component';
import { PipelinesRoutingModule } from './pipelines-routing.module';

@NgModule({
  imports:      [ CommonModule, PipelinesRoutingModule, HttpModule ],
  declarations: [ PipelinesComponent ],
})
export class PipelinesModule {
  constructor(http: Http) {}
}