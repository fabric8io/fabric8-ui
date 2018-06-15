import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';

import { FeatureFlagModule } from '../../feature-flag/feature-flag.module';
import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    FeatureFlagModule,
    FormsModule,
    WidgetsModule,
    PlannerListModule,
    NgArrayPipesModule,
    WorkItemDetailModule
  ],
  declarations: [CreateWorkItemWidgetComponent],
  exports: [CreateWorkItemWidgetComponent]
})
export class CreateWorkItemWidgetModule { }
