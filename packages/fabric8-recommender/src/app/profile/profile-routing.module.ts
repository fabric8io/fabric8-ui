import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile.component';
import { OverviewComponent } from './overview/overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir',
    pathMatch: 'full'
  },
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', component: OverviewComponent },
      { path: 'spaces', loadChildren: './spaces/spaces.module#SpacesModule' },
      { path: 'resources', loadChildren: './resources/resources.module#ResourcesModule' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
