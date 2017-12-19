import { ExtProfile, ProfileService } from './../profile/profile.service';
import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Broadcaster, Notifications, Notification, NotificationType } from 'ngx-base';
import { User, UserService, Entity } from 'ngx-login-client';
import {
  Space,
  Context,
  Contexts,
  ContextTypes,
  SpaceService,
  SpaceNamePipe
} from 'ngx-fabric8-wit';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs';

import { LocalStorageService } from 'angular-2-local-storage';
import { Navigation } from './../models/navigation';
import { MenusService } from '../layout/header/menus.service';

import { EventService } from "./event.service";

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
export class ContextService implements Contexts {

  readonly RECENT_CONTEXT_LENGTH = 8;
  readonly RESERVED_WORDS: string[] = [];
  private _current: Subject<Context> = new ReplaySubject<Context>(1);
  private _default: ConnectableObservable<Context>;
  private _recent: ConnectableObservable<Context[]>;
  private _addRecent: Subject<Context>;
  private _deleteFromRecent: Subject<Context>;
  private _currentUser: string;

  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private menus: MenusService,
    private spaceService: SpaceService,
    private userService: UserService,
    private notifications: Notifications,
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private spaceNamePipe: SpaceNamePipe,
    private eventService: EventService) {

    this._addRecent = new Subject<Context>();
    this._deleteFromRecent = new Subject<Context>();
    // subscribe to delete space event
    this.eventService.deleteSpaceSubject
      .map(val => {
        if (val && val.id) {
          return {
            user: null,
            space: val,
            type: ContextTypes.BUILTIN.get('user'),
            name: 'TO_DELETE',
            path: null
          } as Context;
        } else {
          return {} as Context;
        }
      })
      .subscribe(val => {
        this._deleteFromRecent.next(val);
      });
    // Initialize the default context when the logged in user changes
    this._default = this.userService.loggedInUser
      // First use map to convert the broadcast event to just a username
      .map(val => {
        if (!(val && val.id)) {
          // this is a logout event
        } else if (val.attributes.username) {
          this._currentUser = val.attributes.username;
          return val.attributes.username;
        } else {
          this.notifications.message({
            message: 'Something went badly wrong. Please try again later or ask for help.',
            type: NotificationType.DANGER
          } as Notification);
          console.log('No username attached to user', val);
          throw 'Unknown user';
        }
      })
      .distinctUntilChanged()
      // Then, perform another map to create a context from the user
      .switchMap(val => this.userService.getUserByUsername(val))
      .map(val => {
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
      // Ensure the menus are built
      .do(val => {
        if (val.type) {
          this.menus.attach(val);
        }
      })
      .do(val => {
        if (val.type) {
          console.log('Default Context Changed to', val);
          this.broadcaster.broadcast('defaultContextChanged', val);
        }
      })
      .do(val => {
        if (val.type) {
          // Add to the recent contexts
          this._addRecent.next(val);
        }
      })
      .multicast(() => new ReplaySubject(1));

    // Create the recent space list
    this._recent = Observable.merge(this._addRecent, this._deleteFromRecent)
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours
      .scan(this.updateRecentSpaceList, [])  // The final value to scan is the initial value, used when the app starts
      // Finally save the list of recent contexts
      .do(val => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > this.RECENT_CONTEXT_LENGTH) {
          val.splice(
            this.RECENT_CONTEXT_LENGTH,
            val.length - this.RECENT_CONTEXT_LENGTH
          );
        }
      })
      .do(val => {
        this.saveRecent(val);
      })
      .multicast(() => new ReplaySubject(1));
    // Finally, start broadcasting
    this._default.connect();
    this._recent.connect();
    this.loadRecent().subscribe(
      val => {
        var toto = val;
        val.forEach(space => this._addRecent.next(space))
      }
    );
  }

  get recent(): Observable<Context[]> {
    return this._recent;
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

  updateRecentSpaceList(contextList: Context[], ctx: Context): Context[] {
    if (ctx.space && ctx.space.id && ctx.name == 'TO_DELETE') { // a space deletion
      let indexForSpaceToDelete = contextList.findIndex(x => x.space && x.space.id == ctx.space.id);
      if (indexForSpaceToDelete > -1) { // the space deleted is in the recently visited array
        let copyContext = cloneDeep(contextList);
        const deleted = copyContext.splice(indexForSpaceToDelete, 1);
        contextList = copyContext;
      }
    } else { // a space addition
      // First, check if this context is already in the list
      // If it is, remove it, so we don't get duplicates
      for (let i = contextList.length - 1; i >= 0; i--) {
        if (contextList[i].path === ctx.path) {
          contextList.splice(i, 1);
        }
      }
      // Then add this context to the top of the list
      contextList.unshift(ctx);
    }
    return contextList
  }

  changeContext(navigation: Observable<Navigation>): Observable<Context> {
    let res = navigation
      // Process the navigation only if it is safe
      .filter(val => {
        if (this.checkForReservedWords(val.user)) {
          this.notifications.message({
            message: `${val.user} not found`,
            type: NotificationType.WARNING
          } as Notification);
          console.log(`User name ${val.user} from path ${val.url} contains reserved characters.`);
          return false;
        } else if (this.checkForReservedWords(val.space)) {
          this.notifications.message({
            message: `${val.space} not found`,
            type: NotificationType.WARNING
          } as Notification);
          console.log(`Space name ${val.space} from path ${val.url} contains reserved characters.`);
          return false;
        }
        return true;
      })
      // Fetch the objects from the REST API
      .switchMap(val => {
        if (val.space) {
          // If it's a space that's been requested then load the space creator as the owner
          return this
            .loadSpace(val.user, val.space)
            .map(space => {
              return { user: space.relationalData.creator, space: space } as RawContext;
            })
            .catch((err, caught) => {
              this.notifications.message({
                message: `${val.url} not found`,
                type: NotificationType.WARNING
              } as Notification);
              console.log(`Space with name ${val.space} and owner ${val.user}
                from path ${val.url} was not found because of ${err}`);
              return Observable.throw(`Space with name ${val.space} and owner ${val.user}
                from path ${val.url} was not found because of ${err}`);

            });
        } else {
          // Otherwise, load the user and use that as the owner
          return this
            .loadUser(val.user)
            .map(user => {
              return { user: user, space: null } as RawContext;
            })
            .catch((err, caught) => {
              this.notifications.message({
                message: `${val.url} not found`,
                type: NotificationType.WARNING
              } as Notification);
              console.log(`Owner ${val.user} from path ${val.url} was not found because of ${err}`);
              return Observable.throw(`Owner ${val.user} from path ${val.url} was not found because of ${err}`);
            });
        }
      })
      // Use a map to convert from a navigation url to a context
      .map(val => this.buildContext(val))
      .distinctUntilKeyChanged('path')
      // Broadcast the spaceChanged event
      // Ensure the menus are built
      .do(val => {
        if (val) this.menus.attach(val);
      })
      .do(val => {
        if (val) {
          console.log('Context Changed to', val);
          this.broadcaster.broadcast('contextChanged', val);
        }
      })
      .do(val => {
        if (val && val.space) {
          console.log('Space Changed to', val);
          this.broadcaster.broadcast('spaceChanged', val.space);
        }
      })
      // Subscribe the current context to the revent space collector
      .do(val => {
        if (val) this._addRecent.next(val);
      })
      .do(val => {
        this._current.next(val);
      })
      .multicast(() => new Subject());
    res.connect();
    return res;
  }

  viewingOwnContext(): boolean {
      return this.extractUser() === this._currentUser;
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
      c.name = this.spaceNamePipe.transform(c.space.attributes.name);
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
    if (c.type != null) {
      this.menus.attach(c);
      return c;
    }
  }

  private extractUser(): string {
    let params = this.getRouteParams();
    if (params && params['entity']) {
      return decodeURIComponent(params['entity']);
    }
    return null;
  }


  private loadUser(userName: string): Observable<User> {
    return this.userService
      .getUserByUsername(userName)
      .map(val => {
        if (val && val.id) {
          return val;
        } else {
          throw new Error(`No user found for ${userName}`);
        }
      });
  }

  public extractSpace(): string {
    let params = this.getRouteParams();
    if (params && params['space']) {
      return decodeURIComponent(params['space']);
    }
    return null;
  }

  private getRouteParams(): any {
    if (
      this.router &&
      this.router.routerState &&
      this.router.routerState.snapshot &&
      this.router.routerState.snapshot.root &&
      this.router.routerState.snapshot.root.firstChild
    ) {
      return this.router.routerState.snapshot.root.firstChild.params;
    }
    return null;
  }

  private loadSpace(userName: string, spaceName: string): Observable<Space> {
    if (userName && spaceName) {
      return this.spaceService.getSpaceByName(userName, spaceName);
    } else {
      return Observable.of({} as Space);
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

  private loadRecent(): Observable<Context[]> {
    return this.profileService.current.switchMap(profile => {
      if (profile.store.recentContexts) {
        return Observable.forkJoin((profile.store.recentContexts as RawContext[])
          // We invert the order above when we add recent contexts
          .reverse()
          .map(raw => {
            if (raw.space) {
              return this.spaceService.getSpaceById(raw.space)
                .map(val => this
                  .buildContext({ space: val } as RawContext));
            } else {
              return this.userService.getUserByUserId(raw.user)
                .catch(err => {
                  console.log('Unable to restore recent context', err);
                  return Observable.empty<Context>();
                })
                .map(val => {
                  return this.buildContext({ user: val } as RawContext)
                });
            }
          }));
      } else {
        return Observable.of([]);
      }
    });
  }

  private saveRecent(recent: Context[]) {
    let patch = {
      store: {
        recentContexts: recent.map(ctx => ({
          user: ctx.user.id,
          space: (ctx.space ? ctx.space.id : null)
        } as RawContext))
      }
    } as ExtProfile;
    return this.profileService.silentSave(patch)
      .subscribe(profile => { }, err => console.log('Error saving recent spaces:', err));
  }

}
