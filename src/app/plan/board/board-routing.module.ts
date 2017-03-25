import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// import { WorkItemBoardComponent } from 'fabric8-planner';

import { AuthUserResolve } from '../../shared/common.resolver';
import { BoardComponent } from './board.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
    resolve: {
      authuser: AuthUserResolve
    }//,
    // children: [
    //   {
    //     path: '',
    //     component: WorkItemBoardComponent,
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
export class BoardRoutingModule {}
