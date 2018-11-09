import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FeatureFlagModule } from 'ngx-feature-flag';
import {
  DependencyCheckService,
  GitProviderService,
  HelperService,
  LauncherModule,
  MissionRuntimeService,
  PipelineService,
  ProjectProgressService,
  ProjectSummaryService,
  TargetEnvironmentService,
  TokenProvider
} from 'ngx-launcher';
import { AppLauncherDependencyCheckService } from '../services/app-launcher-dependency-check.service';
import { AppLauncherGitproviderService } from '../services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from '../services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from '../services/app-launcher-pipeline.service';
import { AppLauncherProjectProgressService } from '../services/app-launcher-project-progress.service';
import { AppLauncherProjectSummaryService } from '../services/app-launcher-project-summary.service';
import { AppLauncherTargetEnvironmentService } from '../services/app-launcher-target-environment.service';
import { CheService } from './../../create/codebases/services/che.service';
import { WorkspacesService } from './../../create/codebases/services/workspaces.service';
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
    HelperService,
    { provide: DependencyCheckService, useClass: AppLauncherDependencyCheckService},
    { provide: GitProviderService, useClass: AppLauncherGitproviderService},
    { provide: MissionRuntimeService, useClass: AppLauncherMissionRuntimeService },
    { provide: PipelineService, useClass: AppLauncherPipelineService },
    { provide: ProjectProgressService, useClass: AppLauncherProjectProgressService },
    { provide: ProjectSummaryService, useClass: AppLauncherProjectSummaryService },
    { provide: TargetEnvironmentService, useClass: AppLauncherTargetEnvironmentService},
    CheService,
    TokenProvider,
    WorkspacesService
  ]
})
export class CreateAppModule {}
