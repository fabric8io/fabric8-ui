import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-modal';

import { ToolbarModule } from 'patternfly-ng';

import { WorkspacesToolbarComponent } from './workspaces-toolbar.component';
import { WorkspaceNotFoundModule } from './workspace-not-found/workspace-not-found.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    ModalModule,
    ToolbarModule,
    TooltipModule.forRoot(),
    WorkspaceNotFoundModule
  ],
  declarations: [
    WorkspacesToolbarComponent
  ],
  providers: [
    BsDropdownConfig,
    TooltipConfig
  ],
  exports: [WorkspacesToolbarComponent]
})
export class WorkspacesToolbarModule { }
