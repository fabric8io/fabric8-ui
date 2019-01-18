import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlannerListComponent } from './planner-list.component';

const routes: Routes = [
  {
    path: '',
    component: PlannerListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerListRoutingModule {}
