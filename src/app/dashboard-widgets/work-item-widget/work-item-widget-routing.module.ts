import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateWorkItemOverlayComponent } from '../create-work-item-widget/create-work-item-overlay/create-work-item-overlay.component';

const routes: Routes = [
  {
    path: 'add-work-item',
    component: CreateWorkItemOverlayComponent,
    outlet: 'action'
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkItemWidgetRoutingModule {}
