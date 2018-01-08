import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailAddTypeSelectorModule, WorkItemDetailModule } from 'fabric8-planner';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { WidgetsModule } from 'ngx-widgets';

import { WorkItemsComponent } from './work-items.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule,
    Fabric8WitModule
  ],
  declarations: [WorkItemsComponent],
  exports: [WorkItemsComponent]
})
export class WorkItemsModule { }
