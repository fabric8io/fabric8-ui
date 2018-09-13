import { Component, ErrorHandler, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Broadcaster, Logger } from 'ngx-base';
import { Context, Contexts } from 'ngx-fabric8-wit';
import { Space, SpaceService } from 'ngx-fabric8-wit';
import { User } from 'ngx-login-client';
import { Subscription } from 'rxjs';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'alm-overview-spaces',
  templateUrl: './overview-spaces.component.html',
  styleUrls: ['./overview-spaces.component.less'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnDestroy, OnInit  {
  context: Context;
  loggedInUser: User;
  subscriptions: Subscription[] = [];
  spaces: Space[] = [];
  loading: boolean = false;

  private pageSize: number = 20;

  constructor(
      private contexts: Contexts,
      private logger: Logger,
      private spaceService: SpaceService,
      private broadcaster: Broadcaster,
      private errorHandler: ErrorHandler
  ) { }

  ngOnInit(): void {
    this.subscriptions.push(this.contexts.current.subscribe((ctx: Context) => {
      this.context = ctx;
      this.initSpaces();
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => {
      sub.unsubscribe();
    });
  }

  initSpaces(): void {
    this.loading = true;
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

  fetchMoreSpaces(): void {
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
