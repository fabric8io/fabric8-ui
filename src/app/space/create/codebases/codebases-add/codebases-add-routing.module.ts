import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CodebasesAddComponent } from './codebases-add.component';

export const codebasesAddRoutes: Routes = [
  {
    path: 'add-codebase',
    component: CodebasesAddComponent,
    outlet: 'action'
  }
];

@NgModule({
  imports: [ RouterModule.forChild(codebasesAddRoutes) ],
  exports: [ RouterModule ]
})
export class CodebasesAddRoutingModule {}
