import { OAuthConfigStoreGuard } from './../shared/runtime-console/oauth-config-store-guard.service';
import { RuntimeConsoleResolver } from './runtime-console.resolver';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create.component';
import { CodebasesComponent } from './codebases/codebases.component';

const routes: Routes = [
  {
    path: '',
    component: CreateComponent,
    children: [
      { path: '', component: CodebasesComponent },
      {
        path: 'pipelines',
        loadChildren: './pipelines/pipelines.module#PipelinesModule',
        data: {
          title: 'Pipelines'
        }
      },
      {
        path: 'environments',
        loadChildren: './environments/create-environments.module#CreateEnvironmentsModule',
        data: {
          title: 'Environments'
        }
      },
      {
        path: 'apps',
        loadChildren: './apps/create-apps.module#CreateAppsModule',
        data: {
          title: 'Applications'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
