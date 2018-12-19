import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemDetailComponent } from './work-item-detail.component';

const routes: Routes = [
  {
    path: 'detail/:id',
    component: WorkItemDetailComponent,
  },
  {
    path: ':id',
    component: WorkItemDetailComponent,
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WorkItemDetailRoutingModule {}
