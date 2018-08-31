import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
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
      },
      {
        path: 'resources',
        loadChildren: './resources/resources.module#ResourcesModule'
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule {}
