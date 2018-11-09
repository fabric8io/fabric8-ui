import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
import { AppLaunchCheService } from '../services/app-launcher-che.service';
import { AppLauncherDependencyCheckService } from '../services/app-launcher-dependency-check.service';
import { AppLauncherGitproviderService } from '../services/app-launcher-gitprovider.service';
import { AppLauncherMissionRuntimeService } from '../services/app-launcher-mission-runtime.service';
import { AppLauncherPipelineService } from '../services/app-launcher-pipeline.service';
import { AppLauncherProjectProgressService } from '../services/app-launcher-project-progress.service';
import { AppLauncherProjectSummaryService } from '../services/app-launcher-project-summary.service';
import { AppLauncherTargetEnvironmentService } from '../services/app-launcher-target-environment.service';
import { AppLaunchWorkSpaceService } from '../services/app-launcher-work-space.service';
import { CheService } from './../../create/codebases/services/che.service';
import { WorkspacesService } from './../../create/codebases/services/workspaces.service';
import { ImportAppRoutingModule } from './import-app-routing.module';
import { ImportAppComponent } from './import-app.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ImportAppRoutingModule,
    LauncherModule
  ],
  declarations: [ ImportAppComponent ],
  providers: [
    HelperService,
    WorkspacesService,
    CheService,
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
export class ImportAppModule {}
