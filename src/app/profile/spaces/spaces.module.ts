import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { InfiniteScrollModule } from 'ngx-widgets';

import { FeatureFlagModule } from 'ngx-feature-flag';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpacesComponent }     from './spaces.component';

@NgModule({
  imports: [
    CommonModule,
    SpacesRoutingModule,
    ModalModule.forRoot(),
    InfiniteScrollModule,
    Fabric8WitModule,
    // Must be at the end
    FeatureFlagModule
  ],
  declarations: [ SpacesComponent ]
})
export class SpacesModule {}
