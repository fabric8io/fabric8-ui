import { MenusService } from './../header/menus.service';
import { MenuedContextType } from './../header/menued-context-type';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User, UserService, Entity } from 'ngx-login-client';
import { Space, Contexts, Context, ContextType, ContextTypes, SpaceService } from 'ngx-fabric8-wit';
import { Subject } from 'rxjs/Subject';
import { ReplaySubject } from 'rxjs/ReplaySubject';

import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Observable } from 'rxjs';

import { DummyService } from './../shared/dummy.service';
import { Navigation } from './../models/navigation';

interface RawContext {
  entity: any;
  space: any;
}

/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 *
 */
@Injectable()
export class ContextService implements Contexts {

  readonly RECENT_CONTEXT_LENGTH = 8;

  private _current: ConnectableObservable<Context>;
  private _default: ConnectableObservable<Context>;
  private _recent: ConnectableObservable<Context[]>;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster,
    private user: UserService,
    private menus: MenusService,
    private spaceService: SpaceService) {

    let addRecent = new Subject<Context>();
    // Initialize the default context when the logged in user changes
    this._default = this.broadcaster.on<User>('currentUserChanged')
      // First use map to convert the broadcast event to just a username
      .map(val => {
        if (val.attributes.username) {
          return val.attributes.username;
        } else {
          console.log('No username attached to user', val);
          throw 'Unknown user';
        }
      })
      .distinctUntilChanged()
      // Then, perform another map to create a context from the user
      .map(val => {
        let ctx = {
          user: this.dummy.lookupUser(val),
          space: null,
          type: ContextTypes.BUILTIN.get('user'),
          name: val,
          path: '/' + val
        } as Context;
        return ctx;
      })
      // Ensure the menus are built
      .do(val => {
        this.menus.attach(val);
      })
      .do(val => {
        console.log('Default Context Changed to', val);
        this.broadcaster.broadcast('defaultContextChanged', val);
      })
      .multicast(() => new ReplaySubject(1));
    // Subscribe the the default context to the recent space collector
    this._default.subscribe(addRecent);

    // Compute the current context
    this._current = Observable
      // use combineLatest to give us both the default context and the current
      // context computed from a navigation
      .combineLatest(
      // First, the navigation event
      this.broadcaster.on<Navigation>('navigate')
        // Eliminate duplicate navigation events
        // TODO this doesn't work quite perfectly
        .distinctUntilKeyChanged('url')
        // Extract the entity and space names from the URL
        .map(val => {
          return { entity: this.extractEntity(), space: this.extractSpace() } as RawContext;
        })
        // Process the navigation only if it is safe
        .filter(val => {
          return !(this.checkForReservedWords(val.entity) || this.checkForReservedWords(val.space));
        })
        // Fetch the objects from the REST API
        .switchMap(val => {
          return Observable.zip(
            this.loadUser(val.entity),
            this.loadSpace(val.entity, val.space),
            (entity, space) => {
              return { entity: entity, space: space } as RawContext;
            }
          );
        })
        // Use a map to convert from a navigation url to a context
        .map(val => this.buildContext(val)),
      // Then, the default context
      this._default,
      // Finally, the projection, which allows us to select the default
      // if the comouted context is null
      (c, d) => c || d)
      .distinctUntilKeyChanged('path')
      // Broadcast the spaceChanged event
      // Ensure the menus are built
      .do(val => {
        this.menus.attach(val);
      })
      .do(val => {
        console.log('Context Changed to', val);
        this.broadcaster.broadcast('contextChanged', val);
      })
      .do(val => {
        if (val.space) {
          console.log('Space Changed to', val);
          this.broadcaster.broadcast('spaceChanged', val.space);
        }
      })
      .multicast(() => new ReplaySubject(1));
    // Subscribe the current context to the revent space collector
    this._current.subscribe(addRecent);

    // Create the recent space list
    this._recent = addRecent
      // Map from the context being added to an array of recent contexts
      // The scan operator allows us to access the list of recent contexts and add ours
      .scan((recent, ctx) => {
        // First, check if this context is already in the list
        // If it is, remove it, so we don't get duplicates
        for (let i = recent.length - 1; i >= 0; i--) {
          if (recent[i].path === ctx.path) {
            recent.splice(i, 1);
          }
        }
        // Then add this context to the top of the list
        recent.unshift(ctx);
        return recent;
        // The final value to scan is the initial value, used when the app starts
      }, this.dummy.recent)
      .do(val => {
        // Truncate the number of recent contexts to the correct length
        if (val.length > this.RECENT_CONTEXT_LENGTH) {
          val.splice(
            this.RECENT_CONTEXT_LENGTH,
            val.length - this.RECENT_CONTEXT_LENGTH
          );
        }
      })
      // Finally save the list of recent contexts
      .do(val => {
        this.dummy.recent = val;
        this.broadcaster.broadcast('save');
      })
      .multicast(() => new ReplaySubject(1));
    // Finally, start broadcasting
    this._current.connect();
    this._default.connect();
    this._recent.connect();
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

  get currentUser(): User {
    return this.dummy.currentUser;
  }

  private buildContext(val: RawContext) {
    let ctxEntity: Entity = (val.entity && val.entity.id) ? val.entity : null;
    let ctxSpace: Space = (val.space && val.space.id) ? val.space : null;
    let c: Context = {
      'entity': ctxEntity,
      'space': ctxSpace,
      'type': null,
      'name': null,
      'path': null
    } as Context;
    // TODO Support other types of entity
    if (c.user && c.space) {
      c.type = ContextTypes.BUILTIN.get('space');
      c.path = '/' + c.user.attributes.username + '/' + c.space.attributes.name;
      c.name = c.space.attributes.name;
    } else if (c.user) {
      c.type = ContextTypes.BUILTIN.get('space');;
      // TODO replace path with username once parameterized routes are working
      c.path = '/' + c.user.attributes.username;
      c.name = c.user.attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != null) {
      this.menus.attach(c);
      return c;
    }
  }

  private extractEntity(): string {
    let params = this.getRouteParams();
    if (params) {
      return params['entity'];
    }
    return null;
  }

  private loadUser(entityName: string): Observable<Entity> {
    return Observable.of(this.dummy.lookupUser(entityName));
  }

  private extractSpace(): string {
    let params = this.getRouteParams();
    if (params) {
      return params['space'];
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

  private loadSpace(entityName: string, spaceName: string): Observable<Space> {
    if (entityName && spaceName) {
      return this.spaceService.getSpaceByName(entityName, spaceName);
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
      for (let r of this.dummy.RESERVED_WORDS) {
        if (arg === r) {
          return true;
        }
      }
    }
    return false;
  }

}
