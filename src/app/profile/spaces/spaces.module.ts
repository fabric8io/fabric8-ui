import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { InfiniteScrollModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';

import { SpacesComponent }     from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpaceWizardModule } from '../../space/wizard/space-wizard.module';
import { ForgeWizardModule } from '../../space/forge-wizard/forge-wizard.module';

@NgModule({
  imports:      [ CommonModule, SpacesRoutingModule, ModalModule.forRoot(), ForgeWizardModule, SpaceWizardModule, InfiniteScrollModule, Fabric8WitModule ],
  declarations: [ SpacesComponent ]
})
export class SpacesModule {
  constructor(http: Http) {}
}
