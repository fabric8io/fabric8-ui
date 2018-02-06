import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import {
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService
} from 'ngx-forge';

import { AppLauncherRoutingModule } from './app-launcher-routing.module';
import { AppLauncherComponent } from './app-launcher.component';
import { AppLauncherGitproviderService } from './services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from './services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from './services/app-launcher-pipeline.service';

@NgModule({
  imports: [
    AppLauncherRoutingModule,
    CommonModule,
    FormsModule,
    LauncherModule
  ],
  declarations: [ AppLauncherComponent ],
  providers: [
    { provide: GitProviderService, useClass: AppLauncherGitproviderService},
    { provide: MissionRuntimeService, useClass: AppLauncherMissionRuntimeService },
    { provide: PipelineService, useClass: AppLauncherPipelineService }
  ]
})
export class AppLauncherModule {
  constructor(http: Http) {}
}
