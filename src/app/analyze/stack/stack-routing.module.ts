import { StackOverviewComponent } from './stack-overview/stack-overview.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { StackComponent } from './stack.component';
import { RenderStackDetailsComponent } from './render-stack-details/render-stack-details.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/BalloonPopGame/stack',
    pathMatch: 'full'
  },
  {
    path: '',
    component: StackComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StackRoutingModule { }
