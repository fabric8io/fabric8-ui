import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { ToggleBarComponent } from './toggle-bar.component';

@NgModule({
  imports: [
    NotificationsRoutingModule
  ],
  declarations: [ NotificationsComponent, ToggleBarComponent]
})
export class NotificationsModule {
  constructor(http: Http) {}
}
