import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RedirectStatusComponent } from './redirect-status.component';

const routes: Routes = [
  {
    path: '',
    component: RedirectStatusComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class RedirectStatusRoutingModule {}
