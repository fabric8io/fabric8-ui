import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';

import { ConnectableObservable, Observable } from 'rxjs';

import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Contexts } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { filterOutClosedItems } from '../../shared/workitem-utils';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html'
})
export class CreateWorkItemWidgetComponent implements OnInit {

  @Input() userOwnsSpace: boolean;

  private _myWorkItems: ConnectableObservable<WorkItem[]>;
  myWorkItemsCount: Observable<number>;
  contextPath: Observable<string>;

  constructor(
    private filterService: FilterService,
    private workItemService: WorkItemService,
    private userService: UserService,
    private contexts: Contexts
  ) {}

  ngOnInit() {
    this.contextPath = this.contexts.current.map(context => context.path);
    this._myWorkItems = this.userService
      .getUser()
      .do(() => this.workItemService.buildUserIdMap())
      .switchMap(() => this.userService.loggedInUser)
      .map(user => this.filterService.queryBuilder('assignee', this.filterService.equal_notation, user.id))
      .switchMap(filters => this.workItemService
        .getWorkItems(100000, {expression: filters}))
      .map(val => val.workItems)
      .map(workItems => filterOutClosedItems(workItems))
      // Resolve the work item type
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveType(workItem)))
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveAreaForWorkItem(workItem)))
      // MUST DO creator after area due to bug in planner
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveCreator(workItem)))
      .publishReplay(1);
    this._myWorkItems.connect();
    this.myWorkItemsCount = this._myWorkItems.map(workItems => workItems.length);
  }

  get myWorkItems(): Observable<WorkItem[]> {
    return this._myWorkItems;
  }

}
