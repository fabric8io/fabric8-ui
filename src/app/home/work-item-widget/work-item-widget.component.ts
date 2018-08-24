import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { FilterService, WorkItem, WorkItemService } from 'fabric8-planner';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { User, UserService } from 'ngx-login-client';
import { Subscription } from 'rxjs';

import { filterOutClosedItems } from '../../shared/workitem-utils';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work-item-widget',
  templateUrl: './work-item-widget.component.html',
  styleUrls: ['./work-item-widget.component.less']
})
export class WorkItemWidgetComponent implements OnDestroy, OnInit  {
  currentSpace: Space;
  currentSpaceId: string = 'default';
  loading: boolean = false;
  loggedInUser: User;
  recentSpaces: Space[] = [];
  recentSpaceIndex: number = 0;
  subscriptions: Subscription[] = [];
  workItems: WorkItem[] = [];

  constructor(
      private spacesService: Spaces,
      private filterService: FilterService,
      private workItemService: WorkItemService,
      private userService: UserService) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
    }));
    this.subscriptions.push(spacesService.recent.subscribe(spaces => {
      this.recentSpaces = spaces;
      this.fetchRecentSpace();
    }));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  /**
   * Fetch work items
   */
  fetchWorkItems(): void {
    this.fetchWorkItemsBySpace(this.getSpaceById(this.currentSpaceId));
  }

  // Private

  /**
   * Fetch work items by given space
   *
   * @param space The space to retrieve work items for
   */
  private fetchWorkItemsBySpace(space: Space): void {
    this.currentSpace = space;
    this.subscriptions.push(this.userService
      .getUser()
      .do(() => this.loading = true)
      .do(() => this.workItemService._currentSpace = space)
      .do(() => this.workItemService.buildUserIdMap())
      .switchMap(() => this.userService.loggedInUser)
      .map(user => {
        const assigneeQuery = this.filterService.queryJoiner(
          {},
          this.filterService.and_notation,
          this.filterService.queryBuilder(
            'assignee', this.filterService.equal_notation, user.id
          )
        );
        const spaceQuery = this.filterService.queryBuilder(
          'space', this.filterService.equal_notation, space.id
        );
        return this.filterService.queryJoiner(
          assigneeQuery, this.filterService.and_notation, spaceQuery
        );
      })
      .switchMap(filters => this.workItemService
        .getWorkItems(100000, {expression: filters}))
      .map(val => val.workItems)
      .map(workItems => filterOutClosedItems(workItems))
      // Resolve the work item type, creator and area
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveType(workItem)))
      .do(workItems => workItems.forEach(workItem => {
        try {
          this.workItemService.resolveAreaForWorkItem(workItem);
        } catch (error) { /* No space */ }
      }))
      .do(workItems => {
        workItems.forEach(workItem => {
          if (workItem.relationalData === undefined) {
            workItem.relationalData = {};
          }
        });
      })
      .do(workItems => workItems.forEach(workItem => this.workItemService.resolveCreator(workItem)))
      .do(() => this.loading = false)
      .subscribe(workItems => {
        this.workItems = workItems;
        this.selectRecentSpace(workItems);
      }));
  }

  /**
   * Helper method to retrieve space using ID stored in select menu
   *
   * @param id The ID associated with a space
   * @returns {Space} Returns null if space cannot be found
   */
  private getSpaceById(id: string): Space {
    for (let i = 0; i < this.recentSpaces.length; i++) {
      if (id === this.recentSpaces[i].id) {
        return this.recentSpaces[i];
      }
    }
    return null;
  }

  /**
   * Helper to fetch a recent space
   *
   * @param index The index of the recent space to fetch
   */
  private fetchRecentSpace(): void {
    if (this.recentSpaces === undefined || this.recentSpaces.length === 0) {
      return;
    }
    if (this.recentSpaceIndex !== -1 && this.recentSpaceIndex < this.recentSpaces.length) {
      this.fetchWorkItemsBySpace(this.recentSpaces[this.recentSpaceIndex]);
    }
  }

  /**
   * Helper to select a recent space which is populated with work items assigned to the user
   *
   * @param index The index of the next recent space
   */
  private selectRecentSpace(workItems: WorkItem[]): void {
    if (this.recentSpaceIndex === -1) {
      return;
    }
    if (workItems !== undefined && workItems.length !== 0) {
      this.currentSpaceId = this.recentSpaces[this.recentSpaceIndex].id;
      this.recentSpaceIndex = -1;
    } else {
      this.recentSpaceIndex++;
      this.fetchRecentSpace();
    }
  }
}
