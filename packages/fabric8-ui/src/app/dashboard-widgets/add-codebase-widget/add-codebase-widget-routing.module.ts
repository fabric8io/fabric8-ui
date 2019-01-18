import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';

const routes: Routes = [
  {
    path: '',
    component: AddCodebaseWidgetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddCodebaseWidgetRoutingModule {}
