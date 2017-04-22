import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeveloperPollComponent } from './developer-poll.component';

const routes: Routes = [{
  path: '',
  component: DeveloperPollComponent
}];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class DeveloperPollRoutingModule {}
