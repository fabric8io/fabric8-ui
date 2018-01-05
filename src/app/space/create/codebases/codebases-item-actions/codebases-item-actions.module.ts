import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { DialogModule } from 'ngx-widgets';

import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemActionsComponent } from './codebases-item-actions.component';
import { CodebasesService } from '../services/codebases.service';
import { CodebaseDeleteDialogModule } from '../codebases-delete/codebase-delete-dialog.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CodebaseDeleteDialogModule,
    CommonModule,
    DialogModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemActionsComponent ],
  exports: [ CodebasesItemActionsComponent ],
  providers: [ BsDropdownConfig, CodebasesService, TooltipConfig, WindowService, WorkspacesService ]
})
export class CodebasesItemActionsModule {
  constructor(http: Http) {}
}
