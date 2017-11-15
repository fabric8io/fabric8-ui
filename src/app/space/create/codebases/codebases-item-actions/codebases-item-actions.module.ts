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

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    DialogModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemActionsComponent ],
  exports: [ CodebasesItemActionsComponent ],
  providers: [ BsDropdownConfig, TooltipConfig, WindowService, WorkspacesService, CodebasesService ]
})
export class CodebasesItemActionsModule {
  constructor(http: Http) {}
}
