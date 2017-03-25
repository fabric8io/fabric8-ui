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
      { path: 'pipelines', loadChildren: './pipelines/pipelines.module#PipelinesModule' },
      { path: 'environments', loadChildren: './environments/environments.module#EnvironmentsModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
