import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BacklogComponent } from './backlog.component';

const routes: Routes = [
  {
    path: '',
    component: BacklogComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class BacklogRoutingModule {}
