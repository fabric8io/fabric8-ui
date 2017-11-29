import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeploymentsComponent } from './deployments.component';
import { AuthGuard } from '../../../shared/auth-guard.service';

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
