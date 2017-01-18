import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalyzeOverviewComponent } from './analyze-overview.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyzeOverviewComponent,
    children: [
      {
        path: ''
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AnalyzeOverviewRoutingModule {}
