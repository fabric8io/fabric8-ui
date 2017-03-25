import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OAuthConfigStoreGuard } from './../../shared/runtime-console/oauth-config-store-guard.service';
import { AuthGuard } from './../../shared/auth-guard.service';
import { EnvironmentsComponent } from './environments.component';

const routes: Routes = [
  {
    path: '',
    component: EnvironmentsComponent,
    canActivate: [
      AuthGuard,
      OAuthConfigStoreGuard
      ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EnvironmentsRoutingModule { }
