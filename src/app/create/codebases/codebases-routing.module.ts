import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { codebasesAddRoutes } from './codebases-add/codebases-add-routing.module';
import { CodebasesComponent } from './codebases.component';

const routes: Routes = [
  {
    path: '',
    component: CodebasesComponent,
    children: codebasesAddRoutes
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodebasesRoutingModule {}
