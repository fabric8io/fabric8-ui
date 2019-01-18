import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerBoardComponent } from './planner-board.component';

const routes: Routes = [
  {
    path: 'board',
    component: PlannerBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerBoardRoutingModule {}
