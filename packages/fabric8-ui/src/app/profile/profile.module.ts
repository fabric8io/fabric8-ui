import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CleanupModule } from './cleanup/cleanup.module';
import { OverviewModule } from './overview/overview.module';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [CommonModule, OverviewModule, ProfileRoutingModule, CleanupModule],
  declarations: [ProfileComponent],
})
export class ProfileModule {}
