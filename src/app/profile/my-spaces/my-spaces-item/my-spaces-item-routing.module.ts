import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MySpacesItemComponent } from './my-spaces-item.component';

const routes: Routes = [
  {
    path: 'my-spaces-item',
    component: MySpacesItemComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class MySpacesItemRoutingModule {}
