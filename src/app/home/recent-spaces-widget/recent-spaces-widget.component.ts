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
  private _spaceSubscription: Subscription;
  private _defaultContext: Context;
  private _contextDefaultSubscription: Subscription;
  private _context: Context;
  private _contextSubscription: Subscription;

  constructor(
    private contexts: Contexts,
    private spaces: Spaces,
    private spaceService: SpaceService,
    private router: Router,
    private broadcaster: Broadcaster,
    private logger: Logger
  ) {
    this._spaceSubscription = this.spaces.recent.subscribe(val => this.recent = val);
  }

  ngOnInit(): void {
    this._contextSubscription = this.contexts.current.subscribe(val => {
      this._context = val;
    });
    this._contextDefaultSubscription = this.contexts.default.subscribe(val => {
      this._defaultContext = val;
      this.initSpaces();
    });
  }

  ngOnDestroy(): void {
    this._spaceSubscription.unsubscribe();
    this._contextSubscription.unsubscribe();
    this._contextDefaultSubscription.unsubscribe();
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
