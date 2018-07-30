import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { uniqBy } from 'lodash';

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
    private contextService: ContextService
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
    let filters = [
      {
        paramKey: 'filter[assignee]',
        value: this.context.user.id,
        active: true
      }
    ];
    this.workItemService._currentSpace = space;
    this.subscriptions.push(
      this.workItemService
        .getWorkItems(100000, filters)
        .subscribe(
          (result: {
            workItems: WorkItem[];
            nextLink: string;
            totalCount?: number;
            included?: WorkItem[];
            ancestorIDs?: string[];
          }): void => {
            this.workItems = filterOutClosedItems(result.workItems);
          }
        )
    );
  }
}
