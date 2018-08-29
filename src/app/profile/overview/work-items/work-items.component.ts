import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { uniqBy } from 'lodash';

import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { Subscription } from 'rxjs';
import { ContextService } from '../../../shared/context.service';

import { filterOutClosedItems } from '../../../shared/workitem-utils';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work-items',
  templateUrl: './work-items.component.html',
  styleUrls: ['./work-items.component.less']
})
export class WorkItemsComponent implements OnDestroy, OnInit {
  context: Context;
  currentSpace: Space;
  currentSpaceId: string = 'default';
  subscriptions: Subscription[] = [];
  spaces: Space[] = [];
  workItems: WorkItem[] = [];
  viewingOwnAccount: Boolean;

  constructor(
    private contexts: Contexts,
    private spacesService: Spaces,
    private spaceService: SpaceService,
    private workItemService: WorkItemService,
    private contextService: ContextService,
    private filterService: FilterService
  ) {}

  ngOnInit(): void {
    this.viewingOwnAccount = this.contextService.viewingOwnContext();
    this.subscriptions.push(
      this.contexts.current.subscribe((ctx: Context) => {
        this.context = ctx;
        if (this.context.user.attributes) {
          this.subscriptions.push(
            this.spaceService
              .getSpacesByUser(this.context.user.attributes.username)
              .subscribe(spaces => {
                this.spaces = spaces;
                if (this.viewingOwnAccount) {
                  this.subscriptions.push(
                    this.spacesService.recent.subscribe((recentSpaces: Space[]): void => {
                      if (recentSpaces && recentSpaces.length > 0) {
                        this.spaces = uniqBy(spaces.concat(recentSpaces), 'id');
                        this.attemptSelectSpace(recentSpaces[0]);
                      }
                    })
                  );
                }
              })
          );
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  private attemptSelectSpace(spaceToSelect: Space) {
    let space: Space = this.spaces.find((s: Space) => s.id == spaceToSelect.id);
    if (space !== undefined) {
      this.currentSpace = space;
      this.currentSpaceId = this.currentSpace.id;
      this.fetchWorkItemsBySpace(this.currentSpace);
    }
  }

  fetchWorkItems(): void {
    this.currentSpace = this.spaces.find((s: Space) => s.id === this.currentSpaceId);
    if (this.currentSpace !== undefined) {
      this.fetchWorkItemsBySpace(this.currentSpace);
    }
  }

  private fetchWorkItemsBySpace(space: Space): void {

    const assigneeQuery = this.filterService.queryJoiner(
      {},
      this.filterService.and_notation,
      this.filterService.queryBuilder(
        'assignee', this.filterService.equal_notation, this.context.user.id
      )
    );
    const spaceQuery = this.filterService.queryBuilder(
      'space', this.filterService.equal_notation, space.id
    );
    const filters = this.filterService.queryJoiner(
      assigneeQuery, this.filterService.and_notation, spaceQuery
    );
    this.subscriptions.push(
      this.workItemService
        .getWorkItems(100000, {expression: filters})
        .map(val => val.workItems)
        .map(workItems => filterOutClosedItems(workItems))
        // Resolve the work item type, creator and area
        .subscribe(workItems => {
          this.workItems = workItems;
        })
    );
  }
}
