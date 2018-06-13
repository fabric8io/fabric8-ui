import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';

import { LoadingWidgetModule } from '../../dashboard-widgets/loading-widget/loading-widget.module';
import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { WorkItemBarchartModule } from './work-item-barchart/work-item-barchart.module';
import { WorkItemWidgetComponent } from './work-item-widget.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FeatureFlagModule,
    FormsModule,
    LoadingWidgetModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemBarchartModule,
    WorkItemDetailModule
  ],
  declarations: [WorkItemWidgetComponent],
  exports: [WorkItemWidgetComponent]
})
export class WorkItemWidgetModule { }
