import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs';

import { WorkItemService, WorkItem } from 'fabric8-planner';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';
import { Observable } from "rxjs/Observable";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-work-item-widget',
  templateUrl: './work-item-widget.component.html',
  styleUrls: ['./work-item-widget.component.less'],
  providers: [SpaceService]
})
export class WorkItemWidgetComponent implements OnDestroy, OnInit  {
  currentSpace: Space;
  currentSpaceId: string = "default";
  loggedInUser: User;
  recentSpaces: Space[] = [];
  recentSpaceIndex: number = 0;
  subscriptions: Subscription[] = [];
  spaces: Space[] = [];
  workItems: WorkItem[] = [];

  constructor(
      private spacesService: Spaces,
      private spaceService: SpaceService,
      private workItemService: WorkItemService,
      private userService: UserService) {
    this.subscriptions.push(userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      if (user.attributes) {
        this.subscriptions.push(spaceService.getSpacesByUser(user.attributes.username, 10).subscribe(spaces => {
          this.spaces = spaces;
        }));
      }
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

  /**
   * Fetch space for current space ID
   *
   * @returns {Observable<Space>}
   */
  get space(): Observable<Space> {
    return this.userService.loggedInUser
      .map(user => this.spaceService.getSpacesByUser(user.attributes.username, 10))
      .switchMap(spaces => spaces)
      .map(spaces => {
        for (let i = 0; i < spaces.length; i++) {
          if (this.currentSpaceId === spaces[i].id) {
            return spaces[i];
          }
        }
        return <Space> {};
      });
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
      .do(() => this.workItemService._currentSpace = space)
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
      this.currentSpaceId = this.recentSpaces[this.recentSpaceIndex].id;
      this.recentSpaceIndex = -1;
    } else {
      this.recentSpaceIndex++;
      this.fetchRecentSpace();
    }
  }
}
