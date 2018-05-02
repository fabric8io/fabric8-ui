import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailAddTypeSelectorModule, WorkItemDetailModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';

import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { CreateWorkItemOverlayModule } from './create-work-item-overlay/create-work-item-overlay.module';
import { CreateWorkItemWidgetRoutingModule } from './create-work-item-widget-routing.module';
import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

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
    CreateWorkItemWidgetRoutingModule,
    WorkItemDetailModule,
    WorkItemDetailAddTypeSelectorModule
  ],
  declarations: [CreateWorkItemWidgetComponent],
  exports: [CreateWorkItemWidgetComponent]
})
export class CreateWorkItemWidgetModule { }
