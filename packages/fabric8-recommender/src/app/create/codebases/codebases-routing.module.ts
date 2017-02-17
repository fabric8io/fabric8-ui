import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CodebasesComponent } from './codebases.component';

const routes: Routes = [
  {
    path: '',
    component: CodebasesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodebasesRoutingModule {}
