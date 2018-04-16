import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLauncherComponent } from './app-launcher.component';
import { CreateAppComponent } from './create-app/create-app.component';
import { ImportAppComponent } from './import-app/import-app.component';

export const routes: Routes = [{
  path: '',
  component: AppLauncherComponent,
  children: [{
    path: 'createapp',
    component: CreateAppComponent
  }, {
    path: 'createapp/:projectName',
    component: CreateAppComponent
  }, {
    path: 'importapp',
    component: ImportAppComponent
  }, {
    path: 'importapp/:projectName',
    component: ImportAppComponent
  }]
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AppLauncherRoutingModule {}
