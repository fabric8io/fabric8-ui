import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { EventQuery } from '../../models/event.model';
import { AppState } from '../../states/app.state';
import * as EventActions from './../../actions/event.action';
import { WorkItemUI } from './../../models/work-item';

@Component({
  selector: 'work-item-event-wrapper',
  templateUrl: './work-item-event-wrapper.component.html',
  styleUrls: ['./work-item-event-wrapper.component.less'],
})
export class WorkItemEventWrapperComponent implements OnInit {
  @Input('workItem') set WorkItem(workitem: WorkItemUI) {
    this.workitem = workitem;
    this.store.dispatch(new EventActions.Get(this.workitem.eventLink));
  }

  private emptyStateConfig: EmptyStateConfig;
  private workitem: WorkItemUI = null;
  private events = this.eventsQuery.getEventsWithModifier();

  constructor(private store: Store<AppState>, private eventsQuery: EventQuery) {}

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'There are no Audits for your selected work item',
      title: 'No Audits Available',
    } as EmptyStateConfig;
  }
}
