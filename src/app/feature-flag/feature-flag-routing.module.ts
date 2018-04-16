import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeatureFlagHomeComponent } from './home/feature-flag-home.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureFlagHomeComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class FeatureFlagRoutingModule {}
