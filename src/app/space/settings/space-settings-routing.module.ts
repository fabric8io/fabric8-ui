import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContextCurrentUserGuard } from '../../shared/context-current-user-guard.service';
import { AreasComponent } from './areas/areas.component';
import { SpaceSettingsComponent } from './space-settings.component';

const routes: Routes = [
  {
    path: '',
    resolve: {
      contextGuard: ContextCurrentUserGuard
    },
    component: SpaceSettingsComponent,
    children: [
      { path: '', component: AreasComponent },
      // { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsModule' },
      // { path: 'security', loadChildren: './security/security.module#SecurityModule' },
      // { path: 'work', loadChildren: './work/work.module#WorkModule' },
      {
        path: 'areas',
        loadChildren: './areas/areas.module#AreasModule',
        data: {
          title: 'Areas'
        }
      },
      {
        path: 'collaborators',
        loadChildren: './collaborators/collaborators.module#CollaboratorsModule',
        data: {
          title: 'Collaborators'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceSettingsRoutingModule { }
