import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        // Preserves the navbar and defaults to connected accounts
        path: '',
        loadChildren: './connected-accounts/connected-accounts.module#ConnectedAccountsModule'
      },
      {
        path: 'feature-opt-in',
        loadChildren: './feature-opt-in/feature-opt-in.module#FeatureOptInModule'
      },
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule {}
