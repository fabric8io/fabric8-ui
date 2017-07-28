import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { codebasesAddRoutes } from '../../space/create/codebases/codebases-add/codebases-add-routing.module';

@NgModule({
  imports: [ RouterModule.forChild(codebasesAddRoutes) ],
  exports: [ RouterModule ]
})
export class AddCodebaseWidgetRoutingModule {}
