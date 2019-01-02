import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureFlagResolver } from 'ngx-feature-flag';
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
        resolve: {
          featureFlagConfig: FeatureFlagResolver,
        },
        data: {
          title: 'Pipelines',
          featureName: 'Pipelines',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateRoutingModule {}
