import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AreasComponent }     from './areas.component';
import { AreasRoutingModule } from './areas-routing.module';

@NgModule({
  imports:      [ CommonModule, AreasRoutingModule, HttpModule ],
  declarations: [ AreasComponent ],
})
export class AreasModule {
  constructor(http: Http) {}
}
