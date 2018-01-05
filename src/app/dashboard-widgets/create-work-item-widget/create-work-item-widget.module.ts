import { CreateWorkItemOverlayComponent } from './create-work-item-overlay/create-work-item-overlay.component';
import { CreateWorkItemWidgetRoutingModule } from './create-work-item-widget-routing.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PlannerModule, PlannerListModule, WorkItemDetailModule, WorkItemDetailAddTypeSelectorModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { NgArrayPipesModule } from 'angular-pipes';

import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    CreateWorkItemWidgetRoutingModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [CreateWorkItemWidgetComponent, CreateWorkItemOverlayComponent],
  exports: [CreateWorkItemWidgetComponent]
})
export class CreateWorkItemWidgetModule { }
