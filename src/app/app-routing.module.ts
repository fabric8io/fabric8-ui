import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SigninComponent } from './signin/signin.component';

// import { DataResolver } from './app.resolver';

export const routes: Routes = [
  {
    path: '',
    loadChildren: './home/home.module#HomeModule'
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
    path: 'analyze',
    loadChildren: './analyze/analyze.module#AnalyzeModule'
  },
  {
    path: 'chat',
    loadChildren: './chat/chat.module#ChatModule'
  },
  {
    path: 'collaboration',
    loadChildren: './collaboration/collaboration.module#CollaborationModule'
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'help',
    loadChildren: './help/help.module#HelpModule'
  },
  {
    path: 'learn',
    loadChildren: './learn/learn.module#LearnModule'
  },
  {
    path: 'notifications',
    loadChildren: './notifications/notifications.module#NotificationsModule'
  },
  {
    path: 'overview',
    loadChildren: './overview/overview.module#OverviewModule'
  },
  {
    path: 'pmuir',
    loadChildren: './profile/profile.module#ProfileModule'
  },
  {
    path: 'resources',
    loadChildren: './resources/resources.module#ResourcesModule'
  },
  {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
