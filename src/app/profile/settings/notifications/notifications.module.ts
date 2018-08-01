import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
import { ToggleBarComponent } from './toggle-bar.component';

@NgModule({
  imports: [
    NotificationsRoutingModule,
    HttpClientModule
  ],
  declarations: [ NotificationsComponent, ToggleBarComponent],
  exports: [ToggleBarComponent]
})
export class NotificationsModule {}
