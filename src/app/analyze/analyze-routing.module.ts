import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AnalyzeComponent } from './analyze.component';
import { AnalyzeOverviewComponent } from './analyze-overview/analyze-overview.component';

const routes: Routes = [
  {
    path: '',
    component: AnalyzeComponent,
    children: [
      { path: '', component: AnalyzeOverviewComponent },
      { path: 'readme', loadChildren: './readme/readme.module#ReadmeModule' },
      { path: 'stack', loadChildren: './stack/stack.module#StackModule' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnalyzeRoutingModule { }
