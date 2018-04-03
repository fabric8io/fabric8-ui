import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    SettingsRoutingModule
  ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule {
  constructor(http: Http) {}
}
