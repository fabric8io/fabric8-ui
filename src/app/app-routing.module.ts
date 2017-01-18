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
  // Chat
  // TODO I think this can be removed (PLM)
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  // Dashboard
  // TODO I think this can be removed (PLM)
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  // Help
  // TODO I think this can be removed (PLM)
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule'
  },
  // Learn
  // TODO I think this can be removed (PLM)
  {
    path: 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  // Notifications
  // TODO I think this can be removed (PLM)
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },

  // Parameterized <Entity> route
  // Must be the last item in the routing table, as this essentially acts as a "fallback route"
  {
    path: ':entity',
    children: [
      // Profile
      {
        path: '',
        loadChildren: './profile/profile.module#ProfileModule'
      },
      // Settings
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        // Parameterized <Space> route
        // Must be the last item in the :entity routing table, as this essentially acts as a
        path: ':space',
        children: [
          // Analyze
          {
            path: '',
            loadChildren: './analyze/analyze.module#AnalyzeModule'
          },
          // Plan
          {
            path: 'plan',
            loadChildren: './plan/plan.module#PlanModule'
          },
          // Create
          {
            path: 'create',
            loadChildren: './create/create.module#CreateModule'
          },
          // Run
          {
            path: 'run',
            loadChildren: './run/run.module#RunModule'
          },
          // Space-settings
          {
            path: 'settings',
            loadChildren: './space-settings/space-settings.module#SpaceSettingsModule'
          },

        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
