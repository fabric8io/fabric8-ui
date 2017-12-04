import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Http } from '@angular/http';

import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap';

import { WorkspacesItemActionsComponent } from './workspaces-item-actions.component';
import { WorkspacesService } from '../../codebases/services/workspaces.service';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule
  ],
  declarations: [ WorkspacesItemActionsComponent ],
  exports: [ WorkspacesItemActionsComponent ],
  providers: [
    BsDropdownConfig,
    WorkspacesService
  ]
})
export class WorkspacesItemActionsModule {
  constructor(http: Http) { }
}
