import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailAddTypeSelectorModule, WorkItemDetailModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';

import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { CreateWorkItemOverlayModule } from '../create-work-item-widget/create-work-item-overlay/create-work-item-overlay.module';
import { WorkItemBarchartModule } from './work-item-barchart/work-item-barchart.module';
import { WorkItemWidgetRoutingModule } from './work-item-widget-routing.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    CreateWorkItemOverlayModule,
    FeatureFlagModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemBarchartModule,
    WorkItemWidgetRoutingModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [WorkItemWidgetComponent],
  exports: [WorkItemWidgetComponent]
})
export class WorkItemWidgetModule { }
