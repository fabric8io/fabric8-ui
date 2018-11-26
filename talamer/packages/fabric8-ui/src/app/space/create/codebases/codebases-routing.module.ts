import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../../shared/auth-guard.service';
import { CodebasesComponent } from './codebases.component';

const routes: Routes = [
  {
    path: '',
    component: CodebasesComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodebasesRoutingModule {}
