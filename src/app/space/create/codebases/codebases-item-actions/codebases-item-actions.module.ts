import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemActionsComponent } from './codebases-item-actions.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemActionsComponent ],
  exports: [ CodebasesItemActionsComponent ],
  providers: [ BsDropdownConfig, TooltipConfig, WindowService, WorkspacesService ]
})
export class CodebasesItemActionsModule {
  constructor(http: Http) {}
}
