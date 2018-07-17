import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { DependencyCheckService } from 'ngx-launcher';

import { AppLauncherDependencyCheckService } from '../app-launcher/services/app-launcher-dependency-check.service';
import { CodebasesService } from '../create/codebases/services/codebases.service';
import { DeploymentApiService } from '../create/deployments/services/deployment-api.service';
import { AddAppOverlayComponent } from './add-app-overlay.component';

@NgModule({
  imports: [
    CommonModule,
    Fabric8WitModule,
    FormsModule,
    PopoverModule.forRoot()
  ],
  declarations: [
    AddAppOverlayComponent
  ],
  exports: [
    AddAppOverlayComponent
  ],
  providers: [
    CodebasesService,
    { provide: DependencyCheckService, useClass: AppLauncherDependencyCheckService },
    DeploymentApiService
  ]
})

export class AddAppOverlayModule {

}
