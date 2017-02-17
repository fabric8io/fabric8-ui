import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkspacesComponent } from './workspaces.component';

const routes: Routes = [
  {
    path: '',
    component: WorkspacesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkspacesRoutingModule {}
