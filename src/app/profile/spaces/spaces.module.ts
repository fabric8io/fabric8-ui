import { ModalModule } from 'ngx-modal';
import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SpacesComponent }     from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';
import { SpaceWizardModule } from './../../space-wizard/space-wizard.module';

@NgModule({
  imports:      [ CommonModule, SpacesRoutingModule, HttpModule, ModalModule, SpaceWizardModule ],
  declarations: [ SpacesComponent ]
})
export class SpacesModule {
  constructor(http: Http) {}
}
