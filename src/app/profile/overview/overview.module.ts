import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { OverviewComponent }     from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

@NgModule({
  imports:      [ CommonModule, OverviewRoutingModule, HttpModule ],
  declarations: [ OverviewComponent ],
})
export class OverviewModule {
  constructor(http: Http) {}
}
