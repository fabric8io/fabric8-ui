import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create.component';
import { CodebasesComponent } from './codebases/codebases.component';
import { ExperimentalFeatureResolver } from '../../shared/experimental-feature.resolver';

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
        path: 'apps',
        loadChildren: './apps/apps.module#AppsModule',
        resolve: {
          featureFlagConfig: ExperimentalFeatureResolver
        },
        data: {
          title: 'Applications',
          featureName: 'Applications'
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
