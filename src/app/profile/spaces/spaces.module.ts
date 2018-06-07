import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { InfiniteScrollModule } from 'ngx-widgets';

import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { ForgeWizardModule } from '../../space/forge-wizard/forge-wizard.module';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpacesComponent }     from './spaces.component';

@NgModule({
  imports: [
    CommonModule,
    SpacesRoutingModule,
    ModalModule.forRoot(),
    ForgeWizardModule,
    InfiniteScrollModule,
    Fabric8WitModule,
    // Must be at the end
    FeatureFlagModule ],
  declarations: [ SpacesComponent ]
})
export class SpacesModule {
  constructor(http: Http) {}
}
