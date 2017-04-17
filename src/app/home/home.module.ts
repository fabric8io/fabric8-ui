import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { Http } from '@angular/http';

import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import { SpaceWizardModule } from '../space-wizard/space-wizard.module';

import { HomeComponent }   from './home.component';
import { HomeRoutingModule }   from './home-routing.module';

@NgModule({
  imports:      [ CommonModule, HomeRoutingModule, ModalModule, SpaceWizardModule, Fabric8WitModule ],
  declarations: [ HomeComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}
