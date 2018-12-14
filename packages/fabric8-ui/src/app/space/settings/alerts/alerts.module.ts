import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertsRoutingModule } from './alerts-routing.module';
import { AlertsComponent }     from './alerts.component';

@NgModule({
  imports:      [ CommonModule, AlertsRoutingModule ],
  declarations: [ AlertsComponent ]
})
export class AlertsModule { }
