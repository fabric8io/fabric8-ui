import { ModalModule } from 'ngx-modal';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { InfiniteScrollModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { SpacesComponent }     from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpaceWizardModule } from '../../space/space-wizard/space-wizard.module';

@NgModule({
  imports:      [ CommonModule, SpacesRoutingModule, ModalModule, SpaceWizardModule, InfiniteScrollModule, Fabric8WitModule ],
  declarations: [ SpacesComponent ]
})
export class SpacesModule {
  constructor(http: Http) {}
}
