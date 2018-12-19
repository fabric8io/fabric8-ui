import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlannerQueryComponent } from './planner-query.component';

import { FeatureFlagResolver } from 'ngx-feature-flag';

const routes: Routes = [
  {
    path: 'query',
    component: PlannerQueryComponent,
    resolve: {
      featureFlagConfig: FeatureFlagResolver,
    },
    data: {
      title: 'Query Tab',
      featureName: 'PlannerQuery',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlannerQueryRoutingModule {}
