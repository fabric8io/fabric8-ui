import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollaboratorsComponent } from './collaborators.component';

const routes: Routes = [
  {
    path: '',
    component: CollaboratorsComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CollaboratorsRoutingModule {}
