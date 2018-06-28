import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { ToggleBarComponent } from './toggle-bar.component';

@NgModule({
  imports: [
    NotificationsRoutingModule
  ],
  declarations: [ NotificationsComponent, ToggleBarComponent],
  exports: [ToggleBarComponent]
})
export class NotificationsModule {
  constructor(http: Http) {}
}
