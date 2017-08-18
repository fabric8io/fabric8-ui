import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CleanupComponent } from './cleanup.component';

const routes: Routes = [
  {
    path: '',
    component: CleanupComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CleanupRoutingModule {}
