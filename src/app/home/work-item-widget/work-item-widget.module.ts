import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlannerListModule, WorkItemDetailModule, WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { NgArrayPipesModule } from 'angular-pipes';

import { WorkItemWidgetComponent } from './work-item-widget.component';
import { WorkItemWidgetRoutingModule } from './work-item-widget-routing.module';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemWidgetRoutingModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [WorkItemWidgetComponent],
  exports: [WorkItemWidgetComponent],
})
export class WorkItemWidgetModule { }
