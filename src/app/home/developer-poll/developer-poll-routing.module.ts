import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeveloperPollComponent } from './developer-poll.component';

export const routes: Routes = [{
  path: 'alm-developer-poll',
  component: DeveloperPollComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DeveloperPollRoutingModule {}
