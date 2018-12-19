import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';
import { SpacesModule } from './spaces/overview-spaces.module';
import { WorkItemsModule } from './work-items/work-items.module';

@NgModule({
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SpacesModule,
    TabsModule.forRoot(),
    WorkItemsModule,
  ],
  declarations: [OverviewComponent],
})
export class OverviewModule {}
