import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create.component';
import { CodebasesComponent } from './codebases/codebases.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/BalloonPopGame/create',
    pathMatch: 'full'
  },
  {
    path: '',
    component: CreateComponent,
    children: [
      { path: '', component: CodebasesComponent },
      { path: 'workspaces', loadChildren: './workspaces/workspaces.module#WorkspacesModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateRoutingModule { }
