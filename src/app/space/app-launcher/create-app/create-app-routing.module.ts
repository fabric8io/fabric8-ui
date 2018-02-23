import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateAppComponent } from './create-app.component';

export const routes: Routes = [{
  path: '',
  component: CreateAppComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CreateAppRoutingModule {}
