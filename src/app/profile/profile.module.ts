import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent }     from './profile.component';

import { CleanupModule } from './cleanup/cleanup.module';
import { OverviewModule } from './overview/overview.module';


@NgModule({
  imports:      [ CommonModule, OverviewModule, ProfileRoutingModule, CleanupModule ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule {
  constructor(http: Http) {}
}
