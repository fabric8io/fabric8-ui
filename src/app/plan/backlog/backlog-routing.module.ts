import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { WorkItemListComponent } from 'fabric8-planner';

import { BacklogComponent } from './backlog.component';
import { AuthUserResolve } from '../../shared/common.resolver';

const routes: Routes = [
  {
    path: 'list',
    component: BacklogComponent,
    resolve: {
      authuser: AuthUserResolve
    }//,
    // children: [
    //   {
    //     path: '',
    //     component: WorkItemListComponent,
    //     resolve: {
    //       authuser: AuthUserResolve
    //     },
    //   }
    // ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BacklogRoutingModule {}
