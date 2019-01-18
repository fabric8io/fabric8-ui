import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'plan/list',
    pathMatch: 'full',
  },
  {
    path: 'plan/board',
    loadChildren: './components/plan-board.module#PlanBoardModule',
  },
  {
    path: 'plan/detail',
    loadChildren: './components/plan-detail.module#PlanDetailModule',
  },
  {
    path: 'plan/list',
    loadChildren: './components/plan-list.module#PlanListModule',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
