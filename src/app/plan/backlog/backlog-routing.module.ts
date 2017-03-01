import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BacklogComponent } from './backlog.component';
import { WorkItemListComponent, WorkItemBoardComponent } from 'fabric8-planner';
import { AuthUserResolve } from '../../shared/common.resolver';
import { WorkItemDetailComponent } from 'fabric8-planner/src/app/work-item/work-item-detail/work-item-detail.component';

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
        children: [
          {
            path: 'detail/:id',
            component: WorkItemDetailComponent,
            resolve: {
              authuser: AuthUserResolve
            }
          }
        ]
      },
      {
        path: 'board',
        component: WorkItemBoardComponent,
        resolve: {
          authuser: AuthUserResolve
        },
        children: [
          {
            path: 'detail/:id',
            component: WorkItemDetailComponent,
            resolve: {
              authuser: AuthUserResolve
            }
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BacklogRoutingModule {}
