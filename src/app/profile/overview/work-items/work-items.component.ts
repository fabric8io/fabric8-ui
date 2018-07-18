import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { WorkItem, WorkItemService } from 'fabric8-planner';
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
export class WorkItemsComponent implements OnDestroy, OnInit  {
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
      private contextService: ContextService) {
  }

  ngOnInit(): void {
    this.viewingOwnAccount = this.contextService.viewingOwnContext();
    this.subscriptions.push(this.contexts.current.subscribe((ctx: Context) => {
      this.context = ctx;
      if (this.context.user.attributes) {
        this.subscriptions.push(this.spaceService.getSpacesByUser(this.context.user.attributes.username).subscribe(spaces => {
          this.spaces = spaces;
          if (this.viewingOwnAccount) {
            this.subscriptions.push(this.spacesService.recent.subscribe(recentSpaces => {
              if (recentSpaces && recentSpaces.length > 0) {
                this.mergeSpaces(this.spaces, recentSpaces);
                this.selectSpace(recentSpaces[0]);
              }
            }));
          }
        }));
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  private mergeSpaces(spaces: Space[], recentSpaces: Space[]): void {
    let found: boolean;
    for (let i: number = 0; i < recentSpaces.length; i++) {
      found = false;
      for (let j: number = 0; j < spaces.length; j++) {
        if (recentSpaces[i].id === spaces[j].id) {
          found = true;
          break;
        }
      }
      if (!found) {
        this.spaces.push(recentSpaces[i]);
      }
    }
  }

  private selectSpace(space: Space) {
    for (let i: number = 0; i < this.spaces.length; i++) {
      if (this.spaces[i].id === space.id) {
        this.currentSpace = this.spaces[i];
        this.currentSpaceId = this.currentSpace.id;
        this.fetchWorkItemsBySpace(this.currentSpace);
        break;
      }
    }
  }

  fetchWorkItems(): void {
    this.currentSpace = this.getSpaceById(this.currentSpaceId);
    if (this.currentSpace != null) {
      this.fetchWorkItemsBySpace(this.currentSpace);
    }
  }

  private fetchWorkItemsBySpace(space: Space): void {
    let filters = [{
      paramKey: 'filter[assignee]',
      value: this.context.user.id,
      active: true
    }];
    this.workItemService._currentSpace = space;
    this.subscriptions.push(this.workItemService
      .getWorkItems(100000, filters).subscribe(result => {
        this.workItems = filterOutClosedItems(result.workItems);
      })
    );
  }

  private getSpaceById(id: string): Space {
    for (let i: number = 0; i < this.spaces.length; i++) {
      if (id === this.spaces[i].id) {
        return this.spaces[i];
      }
    }
    return null;
  }
}
