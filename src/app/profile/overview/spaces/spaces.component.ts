import { Component, ErrorHandler, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-spaces',
  templateUrl: './spaces.component.html',
  styleUrls: ['./spaces.component.less'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnDestroy, OnInit  {
  context: Context;
  loggedInUser: User;
  pageSize: number = 20;
  subscriptions: Subscription[] = [];
  // spaceToDelete: Space;
  spaces: Space[] = [];
  loading: boolean = false;
  private space: string;

  constructor(
      private contexts: Contexts,
      private logger: Logger,
      private spaceService: SpaceService,
      private broadcaster: Broadcaster,
      private errorHandler: ErrorHandler
  ) {
    this.space = '';
    this.subscriptions.push(this.contexts.current.subscribe(val => this.context = val));
    this.subscriptions.push(this.broadcaster.on('contextChanged').subscribe(val => {
      this.context = val as Context;
      this.initSpaces({pageSize: this.pageSize});
     }));
  }

  ngOnInit(): void {
    this.initSpaces({pageSize: this.pageSize});
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  // Actions

  initSpaces(event: any): void {
    this.loading = true;
    this.pageSize = event.pageSize;
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, this.pageSize)
        .subscribe(
          (spaces: Space[]): void => {
            this.spaces = spaces;
            this.loading = false;
          },
          (error: any): void => {
            this.logger.error(error);
            this.errorHandler.handleError(error);
            this.loading = false;
          }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
      this.loading = false;
    }
  }

  fetchMoreSpaces($event: any): void {
    if (this.context && this.context.user) {
      this.subscriptions.push(this.spaceService.getMoreSpacesByUser()
        .subscribe(
          (spaces: Space[]): void => {
            this.spaces = this.spaces.concat(spaces);
          },
          (err: any): void => {
            this.logger.error(err);
          }));
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
