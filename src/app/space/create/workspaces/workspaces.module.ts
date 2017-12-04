import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { TooltipConfig, TooltipModule } from 'ngx-bootstrap';

import { ListModule } from 'patternfly-ng';

import { WorkspacesComponent } from './workspaces.component';
import { CreateWorkspacesDialogModule } from './create-workspaces-dialog/create-workspaces-dialog.module';
import { WorkspacesItemModule } from './workspaces-item/workspaces-item.module';
import { WorkspacesItemActionsModule } from './workspaces-item-actions/workspaces-item-actions.module';
import { WorkspacesRoutingModule } from './workspaces-routing.module';
import { WorkspacesToolbarModule } from './workspaces-toolbar/workspaces-toolbar.module';
import { CheService } from '../codebases/services/che.service';
import { CodebasesService } from '../codebases/services/codebases.service';
import { GitHubService } from '../codebases/services/github.service';
import { WorkspacesService } from '../codebases/services/workspaces.service';

@NgModule({
  imports: [
    CommonModule,
    CreateWorkspacesDialogModule,
    FormsModule,
    ListModule,
    TooltipModule.forRoot(),
    WorkspacesItemActionsModule,
    WorkspacesItemModule,
    WorkspacesRoutingModule,
    WorkspacesToolbarModule
  ],
  declarations: [ WorkspacesComponent ],
  exports: [ WorkspacesComponent ],
  providers: [
    CheService,
    CodebasesService,
    GitHubService,
    TooltipConfig,
    WorkspacesService
  ]
})
export class WorkspacesModule {
  constructor(http: Http) { }
}
