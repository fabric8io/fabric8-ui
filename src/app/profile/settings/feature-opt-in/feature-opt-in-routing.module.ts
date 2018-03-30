import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureOptInComponent } from './feature-opt-in.component';
const routes: Routes = [
  {
    path: '',
    component: FeatureOptInComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeatureOptInRoutingModule { }
