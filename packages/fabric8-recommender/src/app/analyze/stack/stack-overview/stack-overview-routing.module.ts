import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StackOverviewComponent } from './stack-overview.component';

const routes: Routes = [
  {
    path: '',
    component: StackOverviewComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackOverviewRoutingModule { }
