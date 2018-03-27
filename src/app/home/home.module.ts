import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { Http }         from '@angular/http';

import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { FeatureFlagModule } from '../feature-flag/feature-flag.module';

import { RecentPipelinesWidgetModule } from '../dashboard-widgets/recent-pipelines-widget/recent-pipelines-widget.module';
import { AddSpaceOverlayModule } from '../space/add-space-overlay/add-space-overlay.module';
import { ForgeWizardModule } from '../space/forge-wizard/forge-wizard.module';
import { SpaceWizardModule } from '../space/wizard/space-wizard.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { WorkItemWidgetModule } from './work-item-widget/work-item-widget.module';

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    SpaceWizardModule,
    ForgeWizardModule,
    Fabric8WitModule,
    FeatureFlagModule,
    WorkItemWidgetModule,
    RecentPipelinesWidgetModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [ HomeComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}
