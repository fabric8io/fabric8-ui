import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkItemWidgetComponent } from './work-item-widget.component';

export const routes: Routes = [{
  path: 'alm-work-item-widget',
  component: WorkItemWidgetComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkItemWidgetRoutingModule {}
