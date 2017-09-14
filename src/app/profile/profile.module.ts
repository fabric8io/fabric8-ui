import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { ProfileComponent }     from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

import { OverviewModule } from './overview/overview.module';
import { CleanupModule } from './cleanup/cleanup.module';


@NgModule({
  imports:      [ CommonModule, OverviewModule, ProfileRoutingModule, CleanupModule ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule {
  constructor(http: Http) {}
}
