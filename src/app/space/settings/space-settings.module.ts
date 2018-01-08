import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { AreasModule } from './areas/areas.module';
import { SettingsOverviewModule } from './settings-overview/settings-overview.module';
import { SpaceSettingsRoutingModule } from './space-settings-routing.module';
import { SpaceSettingsComponent } from './space-settings.component';

@NgModule({
  imports:      [ CommonModule, SpaceSettingsRoutingModule, SettingsOverviewModule, AreasModule ],
  declarations: [ SpaceSettingsComponent ]
})
export class SpaceSettingsModule {
  constructor(http: Http) {}
}
