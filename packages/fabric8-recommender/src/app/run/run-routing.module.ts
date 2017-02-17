import { AuthGuard } from './../shared/auth-guard.service';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RunComponent } from './run.component';
import { PipelinesComponent } from './pipelines/pipelines.component';

const routes: Routes = [
  {
    path: '',
    component: RunComponent,
    children: [
      { path: '', component: PipelinesComponent }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RunRoutingModule {}
