import { CodebasesAddComponent } from './codebases-add.component';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
