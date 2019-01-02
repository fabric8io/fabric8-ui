import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerQueryComponent } from './planner-query.component';

const routes: Routes = [
  {
    path: 'query',
    component: PlannerQueryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerQueryRoutingModule {}
