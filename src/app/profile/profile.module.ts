import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent }     from './profile.component';

import { CleanupModule } from './cleanup/cleanup.module';
import { OverviewModule } from './overview/overview.module';


@NgModule({
  imports:      [ CommonModule, OverviewModule, HttpClientModule, ProfileRoutingModule, CleanupModule ],
  declarations: [ ProfileComponent ]
})
export class ProfileModule {}
