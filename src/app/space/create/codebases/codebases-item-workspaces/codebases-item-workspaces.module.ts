import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    TooltipModule.forRoot()
  ],
  declarations: [ CodebasesItemWorkspacesComponent ],
  exports: [ CodebasesItemWorkspacesComponent ],
  providers: [ BsDropdownConfig, TooltipConfig, WindowService, WorkspacesService ]
})
export class CodebasesItemWorkspacesModule {
  constructor(http: Http) {}
}
