import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { OverviewComponent }     from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { TabsModule } from 'ng2-bootstrap';

@NgModule({
  imports:      [ CommonModule, OverviewRoutingModule, TabsModule.forRoot() ],
  declarations: [ OverviewComponent ],
})
export class OverviewModule {
  constructor(http: Http) {}
}
