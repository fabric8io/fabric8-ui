import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OwnerGuard } from '../../shared/owner-guard.service';
import { UpdateComponent } from './update.component';

const routes: Routes = [
  {
    path: '',
    component: UpdateComponent,
    canActivate: [ OwnerGuard ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class UpdateRoutingModule {}
