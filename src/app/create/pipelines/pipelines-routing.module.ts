import { OAuthConfigStoreGuard } from './../../shared/runtime-console/oauth-config-store-guard.service';
import { RuntimeConsoleResolver } from './../../shared/runtime-console/runtime-console.resolver';
import { AuthGuard } from './../../shared/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PipelinesComponent } from './pipelines.component';

const routes: Routes = [
  {
    path: '',
    component: PipelinesComponent,
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
export class PipelinesRoutingModule { }
