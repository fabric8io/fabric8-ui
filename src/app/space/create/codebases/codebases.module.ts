import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { ActionModule, EmptyStateModule, ListModule } from 'patternfly-ng';

import { CodebasesAddModule } from './codebases-add/codebases-add.module';
import { CodebaseDeleteDialogModule } from './codebases-delete/codebase-delete-dialog.module';
import { CodebasesItemActionsModule } from './codebases-item-actions/codebases-item-actions.module';
import { CodebasesItemDetailsModule } from './codebases-item-details/codebases-item-details.module';
import { CodebasesItemHeadingModule } from './codebases-item-heading/codebases-item-heading.module';
import { CodebasesItemWorkspacesModule } from './codebases-item-workspaces/codebases-item-workspaces.module';
import { CodebasesItemModule } from './codebases-item/codebases-item.module';
import { CodebasesRoutingModule } from './codebases-routing.module';
import { CodebasesToolbarModule } from './codebases-toolbar/codebases-toolbar.module';
import { CodebasesComponent } from './codebases.component';

@NgModule({
  imports: [
    ActionModule,
    BsDropdownModule.forRoot(),
    CodebasesAddModule,
    CodebaseDeleteDialogModule,
    CodebasesItemModule,
    CodebasesItemActionsModule,
    CodebasesItemDetailsModule,
    CodebasesItemHeadingModule,
    CodebasesItemWorkspacesModule,
    CodebasesToolbarModule,
    CodebasesRoutingModule,
    CommonModule,
    EmptyStateModule,
    FormsModule,
    ListModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesComponent ],
  exports: [ CodebasesComponent ],
  providers: [ BsDropdownConfig, TooltipConfig ]
})
export class CodebasesModule {
  constructor(http: Http) { }
}
