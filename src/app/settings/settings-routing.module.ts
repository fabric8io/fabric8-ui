import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/settings',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'beta/pmuir/settings',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'alpha/pmuir/settings',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '',      component: ProfileComponent },
      { path: 'emails', loadChildren: './emails/emails.module#EmailsModule' },
      { path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsModule'
      },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule {}
