import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { WorkItem, WorkItemService } from 'fabric8-planner';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
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
  loading: boolean = true;
  loggedInUser: User;
  recentSpaces: Space[] = [];
  recentSpaceIndex: number = 0;
  spaces: Space[] = [];
  subscriptions: Subscription[] = [];
  workItems: WorkItem[] = [];

  constructor(
      private spaceService: SpaceService,
      private spacesService: Spaces,
      private workItemService: WorkItemService,
      private userService: UserService) {
    this.loggedInUser = this.userService.currentLoggedInUser;
    this.subscriptions.push(this.spaceService.getSpacesByUser(this.loggedInUser.attributes.username).subscribe(spaces => {
      this.spaces = spaces;
      this.loading = false;
    }));
    this.subscriptions.push(spacesService.recent.subscribe(spaces => {
      this.recentSpaces = spaces;
      this.fetchRecentSpace();
      this.loading = false;
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
    this.workItemService._currentSpace = space;
    this.workItemService.buildUserIdMap();
    let filters: any[] = [{
      paramKey: 'filter[assignee]',
      value: this.loggedInUser.id,
      active: true
    }];
    this.subscriptions.push(
      this.workItemService
        .getWorkItems(100000, filters)
        .map(val => val.workItems)
        .map(workItems => filterOutClosedItems(workItems))
        .do(workItems => workItems.forEach(workItem => {
          this.workItemService.resolveType(workItem);
          try {
            this.workItemService.resolveAreaForWorkItem(workItem);
          } catch (error) {
            /* No space */
          }
          if (workItem.relationalData === undefined) {
            workItem.relationalData = {};
          }
          this.workItemService.resolveCreator(workItem);
        }))
        .subscribe(workItems => {
          this.workItems = workItems;
          this.selectRecentSpace(workItems);
        })
    );
  }

  /**
   * Helper method to retrieve space with work items using ID stored in select menu
   *
   * @param id The ID associated with a space
   * @returns {Space} Returns null if space cannot be found
   */
  private getSpaceById(id: string): Space {
    for (let i = 0; i < this.spaces.length; i++) {
      if (id === this.spaces[i].id) {
        return this.spaces[i];
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
      if (this.recentSpaces[this.recentSpaceIndex]) {
        this.currentSpaceId = this.recentSpaces[this.recentSpaceIndex].id;
      }
      this.recentSpaceIndex = -1;
    } else {
      this.recentSpaceIndex++;
      this.fetchRecentSpace();
    }
  }
}
