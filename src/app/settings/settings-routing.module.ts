import { AuthGuard } from './../shared/auth-guard.service';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { ContextCurrentUserGuard } from './../shared/context-current-user-guard.service';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    resolve: {
      contextGuard: ContextCurrentUserGuard
    },
    children: [
      { path: '', component: ProfileComponent },
      { path: 'tokens', loadChildren: './tokens/tokens.module#TokensModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
