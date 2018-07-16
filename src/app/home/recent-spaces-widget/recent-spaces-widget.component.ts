import {
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { Router } from '@angular/router';

import {
  Observable,
  ReplaySubject,
  Subject,
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

  readonly userHasSpaces: Subject<boolean> = new ReplaySubject<boolean>(1);
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
      .flatMap((context: Context): Observable<Context> => {
        if (context && context.user) {
          return Observable.of(context);
        } else {
          return Observable.throw('Failed to retrieve list of spaces owned by user');
        }
      })
      .flatMap((context: Context): Observable<boolean> => this.spaceService
        .getSpacesByUser(context.user.attributes.username)
        .map((spaces: Space[]): boolean => spaces.length > 0)
      )
      .catch((error: any): Observable<any> => {
        this.logger.error(error);
        return Observable.empty();
      })
      .subscribe(this.userHasSpaces);

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
