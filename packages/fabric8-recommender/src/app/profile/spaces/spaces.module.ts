import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SpacesComponent }     from './spaces.component';
import { SpacesRoutingModule } from './spaces-routing.module';

import { SpaceDialogModule } from '../../space-dialog/space-dialog.module';

@NgModule({
  imports:      [ CommonModule, SpacesRoutingModule, HttpModule, SpaceDialogModule ],
  declarations: [ SpacesComponent ],
})
export class SpacesModule {
  constructor(http: Http) {}
}
