import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailAddTypeSelectorModule, WorkItemDetailModule } from 'fabric8-planner';
import { Fabric8WitModule } from 'ngx-fabric8-wit';
import { WidgetsModule } from 'ngx-widgets';
import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';

import { WorkItemWidgetRoutingModule } from './work-item-widget-routing.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

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
    WorkItemDetailAddTypeSelectorModule,
    Fabric8WitModule,
    FeatureFlagModule
  ],
  declarations: [WorkItemWidgetComponent],
  exports: [WorkItemWidgetComponent]
})
export class WorkItemWidgetModule { }
