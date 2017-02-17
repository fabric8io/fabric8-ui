import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReadmeComponent } from './readme.component';

const routes: Routes = [
  {
    path: '',
    component: ReadmeComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ReadmeRoutingModule {}
