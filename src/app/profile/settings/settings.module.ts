import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';

import { DeploymentApiService } from '../../space/create/deployments/services/deployment-api.service';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [
    SettingsRoutingModule
  ],
  declarations: [ SettingsComponent ],
  providers: [ DeploymentApiService ]
})
export class SettingsModule {
  constructor(http: Http) {}
}
