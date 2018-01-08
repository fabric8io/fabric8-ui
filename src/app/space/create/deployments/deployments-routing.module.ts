import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../../../shared/auth-guard.service';
import { DeploymentsComponent } from './deployments.component';

const routes: Routes = [
  {
    path: '',
    component: DeploymentsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DeploymentsRoutingModule {}
