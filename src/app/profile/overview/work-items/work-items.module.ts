import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlannerListModule, WorkItemDetailModule, WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { NgArrayPipesModule } from 'angular-pipes';

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
