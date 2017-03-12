import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SpaceSettingsComponent } from './space-settings.component';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';

const routes: Routes = [
  {
    path: '',
    component: SpaceSettingsComponent,
    children: [
      { path: '', component: SettingsOverviewComponent },
      { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsModule' },
      { path: 'security', loadChildren: './security/security.module#SecurityModule' },
      { path: 'work', loadChildren: './work/work.module#WorkModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceSettingsRoutingModule { }
