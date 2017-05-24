import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { WorkItemDetailModule, WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgArrayPipesModule } from 'angular-pipes';

import { ActivityComponent } from './activity.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    NgArrayPipesModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule,
    Fabric8WitModule
  ],
  declarations: [ActivityComponent],
  exports: [ActivityComponent],
})
export class ActivityModule { }
