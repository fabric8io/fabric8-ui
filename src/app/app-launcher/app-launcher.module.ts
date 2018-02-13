import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import {
  DependencyCheckService,
  GitProviderService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService
} from 'ngx-forge';

import { AppLauncherRoutingModule } from './app-launcher-routing.module';
import { AppLauncherComponent } from './app-launcher.component';
import { AppLauncherDependencyCheckService } from './services/app-launcher-dependency-check.service';
import { AppLauncherGitproviderService } from './services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from './services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from './services/app-launcher-pipeline.service';
import { AppLauncherProjectProgressService } from './services/app-launcher-project-progress.service';
import { AppLauncherProjectSummaryService } from './services/app-launcher-project-summary.service';
import { AppLauncherTargetEnvironmentService } from './services/app-launcher-target-environment.service';

@NgModule({
  imports: [
    AppLauncherRoutingModule,
    CommonModule,
    FormsModule,
    LauncherModule
  ],
  declarations: [ AppLauncherComponent ],
  providers: [
    { provide: DependencyCheckService, useClass: AppLauncherDependencyCheckService},
    { provide: GitProviderService, useClass: AppLauncherGitproviderService},
    { provide: MissionRuntimeService, useClass: AppLauncherMissionRuntimeService },
    { provide: PipelineService, useClass: AppLauncherPipelineService },
    { provide: ProjectProgressService, useClass: AppLauncherProjectProgressService },
    { provide: ProjectSummaryService, useClass: AppLauncherProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: AppLauncherTargetEnvironmentService}
  ]
})
export class AppLauncherModule {
  constructor(http: Http) {}
}
