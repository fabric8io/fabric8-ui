import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SettingsOverviewRoutingModule } from './settings-overview-routing.module';
import { SettingsOverviewComponent } from './settings-overview.component';

@NgModule({
  imports: [CommonModule, SettingsOverviewRoutingModule],
  declarations: [SettingsOverviewComponent],
})
export class SettingsOverviewModule {}
