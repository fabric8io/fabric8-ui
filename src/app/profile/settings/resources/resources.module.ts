import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import { Observable } from 'rxjs';

import { DeploymentApiService } from '../../../space/create/deployments/services/deployment-api.service';
import { ResourceService } from '../services/resource.service';
import { ResourceStatusIcon } from './resource-status-icon.component';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';

@NgModule({
  imports: [
    CommonModule,
    ResourcesRoutingModule
  ],
  declarations: [ ResourcesComponent, ResourceStatusIcon ]
})
export class ResourcesModule {
  constructor(http: Http) {}
}
