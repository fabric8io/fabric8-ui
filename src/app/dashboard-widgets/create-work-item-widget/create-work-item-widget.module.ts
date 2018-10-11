import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgArrayPipesModule } from 'angular-pipes';
import { PlannerListModule, WorkItemDetailModule } from 'fabric8-planner';
import { NgLetModule } from 'fabric8-planner/app/shared/ng-let';
import { FeatureFlagModule } from 'ngx-feature-flag';
import { WidgetsModule } from 'ngx-widgets';
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
    WorkItemDetailModule,
    NgLetModule
  ],
  declarations: [CreateWorkItemWidgetComponent],
  exports: [CreateWorkItemWidgetComponent]
})
export class CreateWorkItemWidgetModule { }
