import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { TabsModule } from 'ngx-bootstrap';

import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { SpacesModule } from './spaces/spaces.module';
import { WorkItemsModule } from './work-items/work-items.module';
import { NotificationsPageModule } from './notifications/notifications-page.module';
import { ConnectedAccountsModule } from './connected-accounts/connected-accounts.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SpacesModule,
    TabsModule.forRoot(),
    WorkItemsModule,
    ConnectedAccountsModule
  ],
  declarations: [ OverviewComponent ],
})
export class OverviewModule {
  constructor(http: Http) {}
}
