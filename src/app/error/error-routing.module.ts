import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ErrorComponent } from './error.component';
import { AuthGuard } from '../shared/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: ErrorComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ErrorRoutingModule {}
