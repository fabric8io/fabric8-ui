import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { ProfileComponent } from './profile.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', component: OverviewComponent },
      {
        path: '_spaces',
        loadChildren: './my-spaces/my-spaces.module#MySpacesModule',
        data: {
          title: 'Spaces',
        },
      },
      {
        path: '_update',
        loadChildren: './update/update.module#UpdateModule',
        data: {
          title: 'Profile',
        },
      },
      {
        path: '_cleanup',
        loadChildren: './cleanup/cleanup.module#CleanupModule',
        data: {
          title: 'Reset Environment',
        },
      },
      {
        path: '_settings',
        loadChildren: './settings/settings.module#SettingsModule',
        data: {
          title: 'Settings',
        },
      },
      {
        path: '_tenant',
        loadChildren: './tenant/tenant.module#TenantModule',
        data: {
          title: 'Tenant',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
