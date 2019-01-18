import { NgModule } from '@angular/core';
import { DeploymentApiService } from '../../space/create/deployments/services/deployment-api.service';
import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings.component';

@NgModule({
  imports: [SettingsRoutingModule],
  declarations: [SettingsComponent],
  providers: [DeploymentApiService],
})
export class SettingsModule {}
