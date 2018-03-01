import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ImportAppComponent } from './import-app.component';

export const routes: Routes = [{
  path: '',
  component: ImportAppComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ImportAppRoutingModule {}
