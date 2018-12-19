import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview.component';
import { SpacesComponent } from './spaces/overview-spaces.component';
import { WorkItemsComponent } from './work-items/work-items.component';

const routes: Routes = [
  {
    path: '',
    component: OverviewComponent,
    children: [
      {
        path: '',
        redirectTo: '_profile',
      },
      {
        path: '_profile',
        children: [
          {
            path: '',
            redirectTo: 'workitems',
          },
          {
            path: 'workitems',
            component: WorkItemsComponent,
          },
          {
            path: 'spaces',
            component: SpacesComponent,
          },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OverviewRoutingModule {}
