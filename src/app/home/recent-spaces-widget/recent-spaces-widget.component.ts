import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import {
  Observable,
  Subscription
} from 'rxjs';

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
    (this.router.url.startsWith('/_home') ? this.contexts.default : this.contexts.current)
      .first()
      .subscribe((context: Context): void => {
        if (context && context.user) {
          this.spaceService
            .getSpacesByUser(context.user.attributes.username, 5)
            .subscribe(spaces => {
              this._spaces = spaces;
            });
        } else {
          this.logger.error('Failed to retrieve list of spaces owned by user');
        }
      });
    this.subscriptions.concat([
      this.spaces.recent.subscribe(val => this.recent = val)
    ]);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => subscription.unsubscribe());
  }

  showAddSpaceOverlay(): void {
    this.broadcaster.broadcast('showAddSpaceOverlay', true);
  }

}
