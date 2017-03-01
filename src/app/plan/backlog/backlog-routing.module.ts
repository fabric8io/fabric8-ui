import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BacklogComponent } from './backlog.component';
import {WorkItemListComponent} from 'fabric8-planner';
import {AuthUserResolve} from '../../shared/common.resolver';

const routes: Routes = [
  {
    path: '',
    component: BacklogComponent,
    resolve: {
      authuser: AuthUserResolve
    },
    children: [
      {
        path: '',
        component: WorkItemListComponent,
        resolve: {
          authuser: AuthUserResolve
        },
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BacklogRoutingModule {}
