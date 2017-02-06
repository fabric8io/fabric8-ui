import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signin',
    component: SigninComponent
  },
  {
    path: 'signup',
    loadChildren: './signup/signup.module#SignupModule'
  },
    {
    path: '_control',
    loadChildren: './control/control.module#ControlModule'
  },
  {
    path: 'password_reset',
    loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule'
  },

  // Home
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule'
  },

  // Analyze
  {
    path: 'pmuir/BalloonPopGame',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },

  // Plan
  {
    path: 'pmuir/BalloonPopGame/plan',
    loadChildren: './plan/plan.module#PlanModule'
  },

  // Create
  {
    path: 'pmuir/BalloonPopGame/create',
    loadChildren: './create/create.module#CreateModule'
  },

  // Run
  {
    path: 'pmuir/BalloonPopGame/run',
    loadChildren: './run/run.module#RunModule'
  },

  // Space-settings
  {
    path: 'pmuir/BalloonPopGame/settings',
    loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
  },

  // Chat
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },

  // Dashboard
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },

  // Help
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule'
  },

  // Learn
  {
    path: 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },

  // Notifications
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },

  // Profile
  {
    path: 'pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },

  // Settings
  {
    path: 'pmuir/settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
