import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import {
  DependencyCheckService,
  DependencyEditorService,
  GitProviderService,
  HelperService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService,
  TokenProvider
} from 'ngx-forge';

import { AppLauncherDependencyCheckService } from '../services/app-launcher-dependency-check.service';
import { AppLauncherDependencyEditorService } from '../services/app-launcher-dependency-editor.service';
import { AppLauncherGitproviderService } from '../services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from '../services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from '../services/app-launcher-pipeline.service';
import { AppLauncherProjectProgressService } from '../services/app-launcher-project-progress.service';
import { AppLauncherProjectSummaryService } from '../services/app-launcher-project-summary.service';
import { AppLauncherTargetEnvironmentService } from '../services/app-launcher-target-environment.service';
import { CreateAppRoutingModule } from './create-app-routing.module';
import { CreateAppComponent } from './create-app.component';

@NgModule({
  imports: [
    CommonModule,
    CreateAppRoutingModule,
    FormsModule,
    LauncherModule
  ],
  declarations: [ CreateAppComponent ],
  providers: [
    HelperService,
    { provide: DependencyEditorService, useClass: AppLauncherDependencyEditorService },
    { provide: DependencyCheckService, useClass: AppLauncherDependencyCheckService},
    { provide: GitProviderService, useClass: AppLauncherGitproviderService},
    { provide: MissionRuntimeService, useClass: AppLauncherMissionRuntimeService },
    { provide: PipelineService, useClass: AppLauncherPipelineService },
    { provide: ProjectProgressService, useClass: AppLauncherProjectProgressService },
    { provide: ProjectSummaryService, useClass: AppLauncherProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: AppLauncherTargetEnvironmentService},
    TokenProvider
  ]
})
export class CreateAppModule {
  constructor(http: Http) {}
}
