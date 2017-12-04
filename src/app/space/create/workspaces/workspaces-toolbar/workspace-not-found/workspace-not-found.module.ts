import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Http } from '@angular/http';
import { RouterModule } from '@angular/router';

import { EmptyStateModule } from 'patternfly-ng';

import { WorkspaceNotFoundComponent } from './workspace-not-found.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    EmptyStateModule
  ],
  declarations: [
    WorkspaceNotFoundComponent
  ],
  providers: [ ],
  exports: [ WorkspaceNotFoundComponent ]
})
export class WorkspaceNotFoundModule {
  constructor(http: Http) { }
}
