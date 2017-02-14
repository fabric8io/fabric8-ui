import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },

  // Redirect login to public to cope with shared login module
  {
    path: 'login',
    redirectTo: 'public',
    pathMatch: 'full'
  },

  // Temporary page to control the app
  {
    path: '_control',
    loadChildren: './control/control.module#ControlModule'
  },

  // Home
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },

  // Analyze
  {
    path: ':entity/:space',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },

  // Plan
  {
    path: ':entity/:space/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },

  // Create
  {
    path: ':entity/:space/create',
    loadChildren: './create/create.module#CreateModule'
  },

  // Run
  {
    path: ':entity/:space/run',
    loadChildren: './run/run.module#RunModule'
  },

  // Space-settings
  {
    path: ':entity/:space/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },

  // Profile
  {
    path: ':entity',
    loadChildren: './profile/profile.module#ProfileModule'
  },

  // Settings
  {
    path: ':entity/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
