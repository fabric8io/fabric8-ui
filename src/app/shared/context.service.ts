import { ErrorHandler, Injectable } from '@angular/core';

import { Broadcaster, Notification, Notifications, NotificationType } from 'ngx-base';
import {
  Context,
  Contexts,
  ContextTypes,
  Space,
  SpaceService
} from 'ngx-fabric8-wit';
import { Feature, FeatureTogglesService } from 'ngx-feature-flag';
import { User, UserService } from 'ngx-login-client';
import { Observable, Scheduler, Subscription } from 'rxjs';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import {
  catchError,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  filter,
  map,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { MenusService } from '../layout/header/menus.service';
import { Navigation } from '../models/navigation';
import { ExtProfile, ProfileService } from '../profile/profile.service';
import { RecentData, RecentUtils } from './recent-utils';

interface RawContext {
  user: any;
  space: any;
  url: string;
}

/*
 * A shared service that manages the users current context. The users context is defined as the
 * user (user or org) and space that they are operating on.
 *
 */
@Injectable()
export class ContextService extends RecentUtils<Context> implements Contexts {

  readonly RESERVED_WORDS: string[] = [];
  private _current: Subject<Context> = new ReplaySubject<Context>(1);
  private _default: ConnectableObservable<Context>;
  private _currentUser: string;
  private _currentContextUser: string;
  private subscriptions: Subscription[] = [];

  constructor(
    protected profileService: ProfileService,
    protected errorHandler: ErrorHandler,
    private broadcaster: Broadcaster,
    private menus: MenusService,
    private userService: UserService,
    private notifications: Notifications,
    private spaceService: SpaceService,
    private toggleService: FeatureTogglesService
  ) {
    super(errorHandler, profileService);
    this.initDefault();
    this.initRecent();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription): void => {
      subscription.unsubscribe();
    });
  }

  private initDefault(): void {
   // Initialize the default context when the logged in user changes
   this._default = this.userService.loggedInUser
    .pipe(
    // First use map to convert the broadcast event to just a username
      map((val: User): string => {
        if (!(val && val.id)) {
          // this is a logout event
          return null;
        } else if (val.attributes.username) {
          this._currentUser = val.attributes.username;
          return val.attributes.username;
        } else {
          this.notifications.message({
            message: 'Something went badly wrong. Please try again later or ask for help.',
            type: NotificationType.DANGER
          } as Notification);
          throw 'Unknown user';
        }
      }),
      filter((val: string): boolean => val !== null),
      distinctUntilChanged(),
      // Then, perform another map to create a context from the user
      switchMap((val: string): Observable<User> => this.userService.getUserByUsername(val)),
      map((val: User): Context => {
        if (val && val.id) {
          return {
            user: val,
            space: null,
            type: ContextTypes.BUILTIN.get('user'),
            name: val.attributes.username,
            path: '/' + val.attributes.username
          } as Context;
        } else {
          return {} as Context;
        }
      })
    ).multicast(() => new ReplaySubject(1));
    this._default.connect();
  }

  private initRecent(): void {
    this.subscriptions.push(
      this.loadRecentContexts().subscribe((contexts: Context[]): void =>
        this._recent.next(contexts)
      )
    );

    this.subscriptions.push(
      this.broadcaster.on<Context>('contextChanged')
        .pipe(
          withLatestFrom(this.recent),
          map(([changedContext, recentContexts]: [Context, Context[]]): RecentData<Context> =>
            this.onBroadcastChanged(changedContext, recentContexts)
          ),
          filter((recentData: RecentData<Context>): boolean => recentData.isSaveRequired)
        )
        .subscribe((recentData: RecentData<Context>): void =>
          this.saveRecentContexts(recentData.data)
        )
    );

    this.subscriptions.push(
      this.broadcaster.on<Space>('spaceDeleted')
        .pipe(
          withLatestFrom(this._recent),
          map(([deletedSpace, recentContexts]: [Space, Context[]]): RecentData<Context> =>
            this.onBroadcastSpaceDeleted(deletedSpace, recentContexts, this.compareContextToSpace)
          ),
          filter((recentData: RecentData<Context>): boolean => recentData.isSaveRequired)
        )
        .subscribe((recentData: RecentData<Context>): void =>
          this.saveRecentContexts(recentData.data)
        )
    );
  }

  // implements recent-utils compareElements()
  compareElements(c1: Context, c2: Context): boolean {
    return c1.name === c2.name;
  }

  // comparator function for space deletion events
  compareContextToSpace(c: Context, s: Space): boolean {
    if (c.space) {
      return c.space.id === s.id;
    } else {
      return false;
    }
  }

  get current(): Observable<Context> {
    return this._current;
  }

  get default(): Observable<Context> {
    return this._default;
  }

  get currentUser(): string {
    return this._currentUser;
  }

  changeContext(navigation: Observable<Navigation>): Observable<Context> {
    let res = navigation.pipe(
      // Fetch the objects from the REST API
      switchMap((val: Navigation): Observable<RawContext | Context> => {
        if (val.space) {
          // If it's a space that's been requested then load the space creator as the owner
          return this
            .loadSpace(val.user, val.space)
            .pipe(
              map((space: Space): RawContext => {
                return { user: space.relationalData.creator, space: space } as RawContext;
              }),
              catchError((err: string): Observable<RawContext> => {
                console.log(`Space with name ${val.space} and owner ${val.user}
                  from path ${val.url} was not found because of ${err}`);
                return Observable.throw(`Space with name ${val.space} and owner ${val.user}
                  from path ${val.url} was not found because of ${err}`);
              })
            );
        } else {
          // Otherwise, load the user and use that as the owner
          return this
            .loadUser(val.user)
            .pipe(
              map((user: User): RawContext => {
                return { user: user, space: null } as RawContext;
              }),
              catchError((err: string): Observable<RawContext> => {
                console.log(`Owner ${val.user} from path ${val.url} was not found because of ${err}`);
                return Observable.throw(`Owner ${val.user} from path ${val.url} was not found because of ${err}`);
              })
            );
        }
      }),
      // Get the list of features enabled for this given user to know whether we should display feature menu.
      switchMap((val: RawContext): Observable<RawContext> => {
        return this.toggleService.getAllFeaturesEnabledByLevel()
          .pipe(
            map((features: Feature[]): RawContext => {
              val.user.features = features;
              return val;
            }),
            catchError((): Observable<RawContext> => {
              return of(val);
            })
          );
      }),
      // Use a map to convert from a navigation url to a context
      map((val: RawContext) => this.buildContext(val)),
      distinctUntilKeyChanged('path'),
      // Broadcast the spaceChanged event
      // Ensure the menus are built
      tap((val: Context): void => {
        if (val) { this.menus.attach(val); }
      }),
      tap((val: Context): void => {
        if (val) {
          this._currentContextUser = val.user.attributes.username;
          this.broadcaster.broadcast('contextChanged', val);
        }
      }),
      tap((val: Context): void => {
        if (val && val.space) {
          this.broadcaster.broadcast('spaceChanged', val.space);
        }
      }),
      tap((val: Context): void => {
        this._current.next(val);
      })
    ).multicast(() => new Subject());
    res.connect();
    return res;
  }

  viewingOwnContext(): boolean {
    return this._currentContextUser === this._currentUser;
  }

  private buildContext(val: RawContext) {
    // TODO Support other types of user
    let c: Context;
    if (val.space) {
      c = {
        'user': val.space.relationalData.creator,
        'space': val.space,
        'type': null,
        'name': null,
        'path': null
      } as Context;
      c.type = ContextTypes.BUILTIN.get('space');
      c.path = '/' + c.user.attributes.username + '/' + c.space.attributes.name;
      c.name = c.space.attributes.name;
    } else if (val.user) {
      c = {
        'user': val.user,
        'space': null,
        'type': null,
        'name': null,
        'path': null
      } as Context;
      c.type = ContextTypes.BUILTIN.get('user');
      // TODO replace path with username once parameterized routes are working
      c.path = '/' + c.user.attributes.username;
      c.name = c.user.attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != undefined) {
      this.menus.attach(c);
      return c;
    }
  }

  private loadUser(userName: string): Observable<User> {
    if (this.checkForReservedWords(userName)) {
      return Observable.throw(new Error(`User name ${userName} contains reserved characters.`), Scheduler.asap);
    }
    return this.userService
      .getUserByUsername(userName)
      .pipe(
        map((val: User): User => {
          if (val && val.id) {
            return val;
          } else {
            throw new Error(`No user found for ${userName}`);
          }
        })
      );
  }

  private loadSpace(userName: string, spaceName: string): Observable<Space> {
    if (this.checkForReservedWords(userName)) {
      return Observable.throw(new Error(`User name ${userName} contains reserved characters.`), Scheduler.asap);
    } else if (this.checkForReservedWords(spaceName)) {
      return Observable.throw(new Error(`Space name ${spaceName} contains reserved characters.`), Scheduler.asap);
    }

    if (userName && spaceName) {
      return this.spaceService.getSpaceByName(userName, spaceName);
    } else {
      return of({} as Space);
    }
  }

  private checkForReservedWords(arg: string): boolean {
    if (arg) {
      // All words starting with _ are reserved
      if (arg.startsWith('_')) {
        return true;
      }
      for (let r of this.RESERVED_WORDS) {
        if (arg === r) {
          return true;
        }
      }
    }
    return false;
  }

  private loadRecentContexts(): Observable<Context[]> {
    return this.profileService.current.switchMap((profile: ExtProfile): Observable<Context[]> => {
      if (profile.store.recentContexts && profile.store.recentContexts.length > 0) {
        return forkJoin((profile.store.recentContexts as RawContext[])
          .map((raw: RawContext): Observable<Context> => {
            if (raw.space) {
              // if getSpaceById() throws an error, forkJoin will not complete and loadRecent will not return
              return this.spaceService.getSpaceById(raw.space).catch((): Observable<Space> => of(null))
                .pipe(
                  map((val: Space): Context => {
                    if (val) {
                      return this.buildContext({ space: val } as RawContext);
                    }
                    return null;
                  })
                );
            } else {
              return this.userService.getUserByUserId(raw.user)
                .pipe(
                  catchError((err: string): Observable<Context> => {
                    console.log('Unable to restore recent context', err);
                    return Observable.empty<Context>();
                  }),
                  map((val: Context | User): Context => {
                    return this.buildContext({ user: val } as RawContext);
                  })
                );
            }
          }))
          .map((contexts: Context[]): Context[] => {
            // remove null context values resulting from getSpaceById throwing an error
            return contexts.filter((context: Context): boolean => context !== null);
          });
      } else {
        return of([]);
      }
    });
  }

  private saveRecentContexts(recent: Context[]): void {
    this._recent.next(recent);
    let patch = {
      store: {
        recentContexts: recent.map(ctx => ({
          user: ctx.user.id,
          space: (ctx.space ? ctx.space.id : null)
        } as RawContext))
      }
    } as ExtProfile;
    this.saveProfile(patch);
  }

}
