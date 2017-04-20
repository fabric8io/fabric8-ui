import { Component, OnInit } from '@angular/core';

import { WorkItemService, WorkItem } from 'fabric8-planner';
import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

@Component({
  selector: 'fabric8-work-item-widget',
  templateUrl: './work-item-widget.component.html',
  styleUrls: ['./work-item-widget.component.scss'],
  providers: [SpaceService]
})
export class WorkItemWidgetComponent implements OnInit {
  currentSpaceId: string = "default";
  index: number = 0;
  loggedInUser: User;
  recentSpaces: Space[] = [];
  spaces: Space[] = [];
  workItems: WorkItem[] = [];

  constructor(
      private spacesService: Spaces,
      private spaceService: SpaceService,
      private workItemService: WorkItemService,
      private userService: UserService) {
    userService.loggedInUser.subscribe(user => {
      this.loggedInUser = user;
      spaceService.getSpacesByUser(user.attributes.username, 10).subscribe(spaces => {
        this.spaces = spaces;
      });
    });
    spacesService.recent.subscribe(spaces => {
      this.recentSpaces = spaces;
      this.selectRecentSpace(this.index);
    });
  }

  ngOnInit() {
  }

  fetchWorkItems(): void {
    this.userService
      .getAllUsers()
      .do(() => this.workItemService._currentSpace = this.getSpaceById(this.currentSpaceId))
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
      .subscribe(workItems => {
        this.workItems = workItems;

        // Select a recent space which is populated with work items assigned to the user
        if (workItems.length > 0) {
          this.index = -1;
        } else if (this.index !== -1) {
          this.index++;
          this.selectRecentSpace(this.index);
        }
      });
  }

  // Private

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
   * Helper to select a recent space which is populated with work items assigned to the user
   *
   * @param index The index of the next recent space
   */
  private selectRecentSpace(index: number): void {
    if (this.recentSpaces === undefined || this.recentSpaces.length === 0) {
      return;
    }
    if (index < this.recentSpaces.length) {
      this.currentSpaceId = this.recentSpaces[index].id;
      this.fetchWorkItems();
    }
  }
}
