import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExpFeaturePageComponent } from './exp-feature-page.component';

const routes: Routes = [
  {
    path: '',
    component: ExpFeaturePageComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ExpFeaturePageRoutingModule {}
