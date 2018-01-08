import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import { ConnectableObservable, Observable } from 'rxjs';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { Broadcaster } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { DummyService } from './../shared/dummy.service';

class WorkItemFilter {

  paramKey: string;
  value: string;
  active: boolean;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html',
  styleUrls: ['./create-work-item-widget.component.less']
})
export class CreateWorkItemWidgetComponent implements OnInit {

  private _myWorkItems: ConnectableObservable<WorkItem[]>;
  myWorkItemsCount: Observable<number>;
  contextPath: Observable<string>;

  constructor(
    private context: Contexts,
    private broadcaster: Broadcaster,
    private workItemService: WorkItemService,
    private userService: UserService,
    private contexts: Contexts
  ) { }

  ngOnInit() {
    this.contextPath = this.contexts.current.map(context => context.path);
    this._myWorkItems = this.userService
      .getUser()
      .do(() => this.workItemService.buildUserIdMap())
      .switchMap(() => this.userService.loggedInUser)
      .map(user => [{
        paramKey: 'filter[assignee]',
        value: user.id,
        active: true
      }])
      .switchMap(filters => this.workItemService
        .getWorkItems(100000, filters))
      .map(val => val.workItems)
      // Resolve the work item type, creator and area
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveType(workItem)))
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveAreaForWorkItem(workItem)))
      // MUST DO creator after area due to bug in planner
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveCreator(workItem)))
      .do(val => console.log(val))
      .publishReplay(1);
    this._myWorkItems.connect();
    this.myWorkItemsCount = this._myWorkItems.map(workItems => workItems.length);
  }

  get myWorkItems(): Observable<WorkItem[]> {
    return this._myWorkItems;
  }

}
