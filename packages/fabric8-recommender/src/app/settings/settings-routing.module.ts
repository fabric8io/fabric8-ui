import { ContextCurrentUserAuthGuard } from './../shared/context-current-user-auth-guard.service';
import { NgModule } from '@angular/core';
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
    component: SettingsComponent,
    canActivate: [ContextCurrentUserAuthGuard],
    canActivateChild: [ContextCurrentUserAuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'emails', loadChildren: './emails/emails.module#EmailsModule' },
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
