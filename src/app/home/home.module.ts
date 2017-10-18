import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SpaceWizardModule } from '../space/wizard/space-wizard.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { WorkItemWidgetModule } from './work-item-widget/work-item-widget.module';
import { RecentPipelinesWidgetModule } from '../dashboard-widgets/recent-pipelines-widget/recent-pipelines-widget.module';
import { ForgeWizardModule } from '../space/forge-wizard/forge-wizard.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SpaceWizardModule,
    ForgeWizardModule,
    Fabric8WitModule,
    WorkItemWidgetModule,
    RecentPipelinesWidgetModule,
    ModalModule.forRoot()
  ],
  declarations: [ HomeComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}
