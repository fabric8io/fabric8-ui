import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { WindowService } from '../services/window.service';
import { WorkspacesService } from '../services/workspaces.service';
import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule
  ],
  declarations: [ CodebasesItemWorkspacesComponent ],
  exports: [ CodebasesItemWorkspacesComponent ],
  providers: [WindowService, WorkspacesService]
})
export class CodebasesItemWorkspacesModule {
  constructor(http: Http) {}
}
