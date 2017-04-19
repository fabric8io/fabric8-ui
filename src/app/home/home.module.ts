import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import { SpaceWizardModule } from '../space-wizard/space-wizard.module';

import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { DeveloperPollModule } from './developer-poll/developer-poll.module';
import { WorkItemWidgetModule } from './work-item-widget/work-item-widget.module';

@NgModule({
  imports: [
    CommonModule,
    DeveloperPollModule,
    HomeRoutingModule,
    ModalModule,
    SpaceWizardModule,
    Fabric8WitModule,
    WorkItemWidgetModule
  ],
  declarations: [ HomeComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}
