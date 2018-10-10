import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Contexts, Space } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { filterOutClosedItems, WorkItemsData } from '../../shared/workitem-utils';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html'
})
export class CreateWorkItemWidgetComponent implements OnInit {

  @Input() userOwnsSpace: boolean;
  @Input() loggedInUser: User;
  @Input() currentSpace: Space;

  private _myWorkItems: WorkItem[];
  myWorkItemsCount: number;
  contextPath: Observable<string>;
  subscriptions: Subscription[] = [];

  constructor(
    private filterService: FilterService,
    private workItemService: WorkItemService,
    private contexts: Contexts
  ) {}

  ngOnInit() {
    this.contextPath = this.contexts.current.pipe(map(context => context.path));
    this.getCurrentSpaceWorkItems();
  }

  ngOnChanges() {
    this.getCurrentSpaceWorkItems();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  get myWorkItems(): WorkItem[] {
    return this._myWorkItems;
  }

  getCurrentSpaceWorkItems() {
    const assigneeQuery = this.filterService.queryJoiner(
      {},
      this.filterService.and_notation,
      this.filterService.queryBuilder(
        'assignee', this.filterService.equal_notation, this.loggedInUser.id
      )
    );
    const spaceQuery = this.filterService.queryBuilder(
      'space', this.filterService.equal_notation, this.currentSpace.id
    );
    const filters = this.filterService.queryJoiner(
      assigneeQuery, this.filterService.and_notation, spaceQuery
    );
    this.subscriptions.push(
      this.workItemService
       .getWorkItems(100000, {expression: filters}).pipe(
          map((val: WorkItemsData) => val.workItems),
          map((workItems: WorkItem[]) => filterOutClosedItems(workItems)),
          // Resolve the work item type
          tap((workItems: WorkItem[]) => workItems.forEach((workItem: WorkItem) => this.workItemService.resolveType(workItem))),
          tap((workItems: WorkItem[]) => workItems.forEach((workItem: WorkItem) => this.workItemService.resolveAreaForWorkItem(workItem))),
          tap((workItems: WorkItem[]) => {
            workItems.forEach((workItem: WorkItem) => {
              if (workItem.relationalData === undefined) {
                workItem.relationalData = {};
              }
            });
          })
        ).subscribe((workitems: WorkItem[]) => {
          this._myWorkItems = workitems;
          this.myWorkItemsCount = workitems.length;
        }
      )
    );
  }
}
