import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureFlagResolver } from '../../feature-flag/resolver/feature-flag.resolver';
import { CodebasesComponent } from './codebases/codebases.component';
import { CreateComponent } from './create.component';

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
          featureFlagConfig: FeatureFlagResolver
        },
        data: {
          title: 'Environments',
          featureName: 'Environments'
        }
      },
      {
        path: 'apps',
        loadChildren: './apps/create-apps.module#CreateAppsModule',
        resolve: {
          featureFlagConfig: FeatureFlagResolver
        },
        data: {
          title: 'Applications',
          featureName: 'Applications'
        }
      },
      {
        path: 'deployments',
        loadChildren: './deployments/deployments.module#DeploymentsModule',
        resolve: {
          featureFlagConfig: FeatureFlagResolver
        },
        data: {
          title: 'Deployments',
          featureName: 'Deployments'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
