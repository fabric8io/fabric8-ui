import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './../../shared/auth-guard.service';
import { OAuthConfigStoreGuard } from './../../shared/runtime-console/oauth-config-store-guard.service';
import { RuntimeConsoleResolver } from './../../shared/runtime-console/runtime-console.resolver';
import { PipelinesComponent } from './pipelines.component';

const routes: Routes = [
  {
    path: '',
    component: PipelinesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PipelinesRoutingModule { }
