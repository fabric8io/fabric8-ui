import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import {
  Broadcaster,
  Logger
} from 'ngx-base';
import {
  Context,
  Contexts,
  Space,
  Spaces,
  SpaceService
} from 'ngx-fabric8-wit';

@Component({
  selector: 'fabric8-recent-spaces-widget',
  templateUrl: './recent-spaces-widget.component.html'
})
export class RecentSpacesWidget implements OnInit, OnDestroy {

  @Input() cardSizeClass: string;

  _spaces: Space[] = [];
  recent: Space[] = [];
  private _defaultContext: Context;
  private _context: Context;

  private readonly subscriptions: Subscription[] = [];

  constructor(
    private contexts: Contexts,
    private spaces: Spaces,
    private spaceService: SpaceService,
    private router: Router,
    private broadcaster: Broadcaster,
    private logger: Logger
  ) { }

  ngOnInit(): void {
    this.subscriptions.concat([
      this.spaces.recent.subscribe(val => this.recent = val),
      this.contexts.current.subscribe(val => {
        this._context = val;
      }),
      this.contexts.default.subscribe(val => {
        this._defaultContext = val;
        this.initSpaces();
      })
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  initSpaces() {
    if (this.context && this.context.user) {
      this.spaceService
        .getSpacesByUser(this.context.user.attributes.username, 5)
        .subscribe(spaces => {
          this._spaces = spaces;
        });
    } else {
      this.logger.error('Failed to retrieve list of spaces owned by user');
    }
  }

  get context(): Context {
    if (this.router.url.startsWith('/_home')) {
      return this._defaultContext;
    } else {
      return this._context;
    }
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
