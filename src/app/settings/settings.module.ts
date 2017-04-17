import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { Http } from '@angular/http';

import { SettingsComponent }     from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

import { ProfileModule } from './profile/profile.module'

@NgModule({
  imports:      [ CommonModule, SettingsRoutingModule, ProfileModule ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule {
  constructor(http: Http) {}
}
