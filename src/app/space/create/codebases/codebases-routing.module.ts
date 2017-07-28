import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { codebasesAddRoutes } from './codebases-add/codebases-add-routing.module';
import { CodebasesComponent } from './codebases.component';
import { AuthGuard } from '../../../shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: CodebasesComponent,
    canActivate: [AuthGuard],
    children: codebasesAddRoutes
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodebasesRoutingModule {}
