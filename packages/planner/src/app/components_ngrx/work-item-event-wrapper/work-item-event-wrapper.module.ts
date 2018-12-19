import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollapseModule } from 'ngx-bootstrap';
import { EmptyStateModule } from 'patternfly-ng/empty-state';
import { EventQuery } from '../../models/event.model';
import { WorkItemEventModule } from '../work-item-event/work-item-event.module';
import { WorkItemEventWrapperComponent } from './work-item-event-wrapper.component';

@NgModule({
  imports: [CommonModule, CollapseModule, EmptyStateModule, WorkItemEventModule],
  declarations: [WorkItemEventWrapperComponent],
  exports: [WorkItemEventWrapperComponent],
  providers: [EventQuery],
})
export class WorkItemEventWrapperModule {}
