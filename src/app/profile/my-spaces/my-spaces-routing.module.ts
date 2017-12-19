import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MySpacesComponent } from './my-spaces.component';

const routes: Routes = [
  {
    path: '',
    component: MySpacesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MySpacesRoutingModule {}
