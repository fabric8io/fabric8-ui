import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlagModule } from 'ngx-feature-flag';
import {
  LauncherModule
} from 'ngx-launcher';
import { CheService } from '../../create/codebases/services/che.service';
import { WorkspacesService } from '../../create/codebases/services/workspaces.service';
import { CreateAppRoutingModule } from './create-app-routing.module';
import { CreateAppComponent } from './create-app.component';

@NgModule({
  imports: [
    CommonModule,
    CreateAppRoutingModule,
    FeatureFlagModule,
    FormsModule,
    LauncherModule
  ],
  declarations: [ CreateAppComponent ],
  providers: [
    CheService,
    WorkspacesService
  ]
})
export class CreateAppModule {}
