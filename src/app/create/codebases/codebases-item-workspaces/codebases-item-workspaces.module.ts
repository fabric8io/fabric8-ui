import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DropdownModule, TooltipModule } from 'ng2-bootstrap';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';

import { CodebasesItemWorkspacesComponent } from './codebases-item-workspaces.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    TooltipModule
  ],
  declarations: [ CodebasesItemWorkspacesComponent ],
  exports: [ CodebasesItemWorkspacesComponent ]
})
export class CodebasesItemWorkspacesModule {
  constructor(http: Http) {}
}
