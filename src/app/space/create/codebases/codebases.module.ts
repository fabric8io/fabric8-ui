import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { ListModule } from 'patternfly-ng';

import { CodebasesAddModule } from './codebases-add/codebases-add.module';
import { CodebasesComponent } from './codebases.component';
import { CodebasesItemModule } from './codebases-item/codebases-item.module';
import { CodebasesItemActionsModule } from './codebases-item-actions/codebases-item-actions.module';
import { CodebasesItemDetailsModule } from './codebases-item-details/codebases-item-details.module';
import { CodebasesItemWorkspacesModule } from './codebases-item-workspaces/codebases-item-workspaces.module';
import { CodebasesToolbarModule } from './codebases-toolbar/codebases-toolbar.module';
import { CodebasesRoutingModule } from './codebases-routing.module';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CodebasesAddModule,
    CodebasesItemModule,
    CodebasesItemActionsModule,
    CodebasesItemDetailsModule,
    CodebasesItemWorkspacesModule,
    CodebasesToolbarModule,
    CodebasesRoutingModule,
    CommonModule,
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
