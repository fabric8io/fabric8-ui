import { AuthGuard } from './../../shared/auth-guard.service';
import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ResourcesComponent } from './resources.component';
import { ContextCurrentUserGuard } from './../../shared/context-current-user-guard.service';

const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    resolve: {
      contextGuard: ContextCurrentUserGuard
    },
    component: ResourcesComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class ResourcesRoutingModule {}
