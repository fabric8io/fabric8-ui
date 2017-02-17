import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlanComponent } from './plan.component';
import { BacklogComponent } from './backlog/backlog.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/BalloonPopGame/plan',
    pathMatch: 'full'
  },
  {
    path: '',
    component: PlanComponent,
    children: [
      { path: '', component: BacklogComponent },
      { path: 'board', loadChildren: './board/board.module#BoardModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PlanRoutingModule { }
