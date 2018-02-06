import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../shared/auth-guard.service';
import { AppLauncherComponent } from './app-launcher.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: AppLauncherComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AppLauncherRoutingModule {}
