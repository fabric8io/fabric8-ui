import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Contexts, Space } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import {
  buildAssigneeQuery,
  buildClosedWorkItemQuery,
  buildSpaceQuery,
  WorkItemsData,
} from '../../shared/workitem-utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-create-work-item-widget',
  templateUrl: './create-work-item-widget.component.html',
})
export class CreateWorkItemWidgetComponent implements OnInit {
  @Input() userOwnsSpace: boolean;
  @Input() loggedInUser: User;
  @Input() currentSpace: Space;

  private _myWorkItems: Observable<WorkItem[]>;
  contextPath: Observable<string>;

  constructor(
    private filterService: FilterService,
    private workItemService: WorkItemService,
    private contexts: Contexts,
  ) {}

  ngOnInit() {
    this.contextPath = this.contexts.current.pipe(map((context) => context.path));
    this.fetchWorkItems();
  }

  ngOnChanges() {
    this.fetchWorkItems();
  }

  get myWorkItems(): Observable<WorkItem[]> {
    return this._myWorkItems;
  }

  set myWorkItems(workItems: Observable<WorkItem[]>) {
    this._myWorkItems = workItems;
  }

  fetchWorkItems(): void {
    let filters = {};
    [
      buildAssigneeQuery(this.filterService, this.loggedInUser.id),
      buildSpaceQuery(this.filterService, this.currentSpace.id),
      buildClosedWorkItemQuery(this.filterService),
    ].forEach((query) => {
      filters = this.filterService.queryJoiner(filters, this.filterService.and_notation, query);
    });

    this.myWorkItems = this.workItemService.getWorkItems(100000, { expression: filters }).pipe(
      map((val: WorkItemsData): WorkItem[] => val.workItems),
      // Resolve the work item type
      tap(
        (workItems: WorkItem[]): void =>
          workItems.forEach(
            (workItem: WorkItem): void => this.workItemService.resolveType(workItem),
          ),
      ),
      tap(
        (workItems: WorkItem[]): void =>
          workItems.forEach(
            (workItem: WorkItem): void => this.workItemService.resolveAreaForWorkItem(workItem),
          ),
      ),
      tap(
        (workItems: WorkItem[]): void => {
          workItems.forEach(
            (workItem: WorkItem): void => {
              if (workItem.relationalData === undefined) {
                workItem.relationalData = {};
              }
            },
          );
        },
      ),
    );
  }
}
