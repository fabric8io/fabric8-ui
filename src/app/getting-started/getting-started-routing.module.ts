import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../shared/auth-guard.service';
import { GettingStartedComponent } from './getting-started.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: GettingStartedComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class GettingStartedRoutingModule {}
