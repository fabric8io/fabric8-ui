import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SlideOutExampleComponent } from './slide-out-example.component';

const routes: Routes = [
  {
    path: '',
    component: SlideOutExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SlideOutExampleRoutingModule {}
