import { CreateWorkItemOverlayComponent } from './create-work-item-overlay/create-work-item-overlay.component';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { codebasesAddRoutes } from '../../space/create/codebases/codebases-add/codebases-add-routing.module';

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
export class CreateWorkItemWidgetRoutingModule {}
