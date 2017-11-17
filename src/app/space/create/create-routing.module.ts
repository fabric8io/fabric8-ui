import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create.component';
import { CodebasesComponent } from './codebases/codebases.component';
import { ExperimentalFeatureResolver } from '../../shared/experimental-feature.resolver';
import { useRuntimeConsole } from './config/use-runtime-console';

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
        resolve: {
          featureFlagConfig: ExperimentalFeatureResolver
        },
        data: {
          title: 'Environments',
          featureName: 'Environments'
        }
      },
      {
        path: useRuntimeConsole() ? 'apps' : 'deployments',
        loadChildren: './apps/apps.module#AppsModule',
        resolve: {
          featureFlagConfig: ExperimentalFeatureResolver
        },
        data: {
          title: useRuntimeConsole() ? 'Applications' : 'Deployments',
          featureName: useRuntimeConsole() ? 'Applications' : 'Deployments'
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
