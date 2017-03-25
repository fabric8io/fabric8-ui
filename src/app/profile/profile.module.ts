import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { ProfileComponent }     from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

import { OverviewModule } from './overview/overview.module';


@NgModule({
  imports:      [ CommonModule, OverviewModule, ProfileRoutingModule, HttpModule ],
  declarations: [ ProfileComponent ],
})
export class ProfileModule {
  constructor(http: Http) {}
}
