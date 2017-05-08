import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';
import { TabsModule } from 'ng2-bootstrap';

import { ActivityModule } from './activity/activity.module';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';
import { SpacesModule } from './spaces/spaces.module';
import { WorkItemsModule } from './work-items/work-items.module';

@NgModule({
  imports: [
    ActivityModule,
    CommonModule,
    OverviewRoutingModule,
    SpacesModule,
    TabsModule.forRoot(),
    WorkItemsModule
  ],
  declarations: [ OverviewComponent ],
})
export class OverviewModule {
  constructor(http: Http) {}
}
