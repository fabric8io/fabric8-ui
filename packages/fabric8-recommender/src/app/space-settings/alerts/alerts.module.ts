import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { AlertsComponent }     from './alerts.component';
import { AlertsRoutingModule } from './alerts-routing.module';

@NgModule({
  imports:      [ CommonModule, AlertsRoutingModule, HttpModule ],
  declarations: [ AlertsComponent ],
})
export class AlertsModule {
  constructor(http: Http) {}
}