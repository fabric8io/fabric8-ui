import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule
  ],
  declarations: [ CodebasesItemWorkspacesComponent ],
  exports: [ CodebasesItemWorkspacesComponent ],
  providers: [ BsDropdownConfig, WindowService, WorkspacesService ]
})
export class CodebasesItemWorkspacesModule {
  constructor(http: Http) {}
}
