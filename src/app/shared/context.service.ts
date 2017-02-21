import { Space } from './../models/space';
import { ContextType } from './../models/context-type';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, User, UserService, Entity } from 'ngx-login-client';

import { Context } from './../models/context';
import { DummyService } from './../shared/dummy.service';

/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 *
 */
@Injectable()
export class ContextService {

  readonly RECENT_CONTEXT_LENGTH = 8;

  private _current: Context;
  private _default: Context;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster,
    private user: UserService) {
    // Listen for any context refreshes requested by the app
    this.broadcaster.on<any>('navigate').subscribe(message => {
      this.current = this.computeContext(message.url);
    });

    // Initialize the default context when the logged in user changes and add as a recent context
    this.broadcaster.on<User>('currentUserChanged').subscribe(message => {
      if (message.attributes.username) {
        let c: Context = {
          'entity': this.dummy.lookupEntity(message.attributes.username),
          'space': null,
          'type': 'user',
          'name': message.attributes.username,
          'path': '/' + message.attributes.username
        } as Context;
        this.buildContextMenus(c);
        this._default = c;
        console.log('Initializing default context for ' + message.attributes.username, this._default + ';');
        this.addRecentContext(this._default);
      }
      // recompute the context if needed
      this.current = this.computeContext(this.router.url);
      // Initialize all recent contexts
      for (let c of this.recent) {
        this.buildContextMenus(c);
      }
    });
    // Finally, compute the initial Context
    this.computeContext(this.router.url);
  }

  get recent(): Context[] {
    return this.dummy.recent;
  }

  get current(): Context {
    return this._current;
  }

  lookupContextType(type: string): ContextType {
    let ct = this.dummy.CONTEXT_TYPES.get(type);
    // Make a copy of the context type before returning
    return ct ? JSON.parse(JSON.stringify(ct)) : null;
  }

  set current(context: Context) {
    if (!context) {
      context = this._default;
    }
    if (this._current !== context) {
      // If the context changed
      this._current = context;
      this.addRecentContext(context);
      this.broadcaster.broadcast('contextChanged', context);
      if (context.space) {
        this.broadcaster.broadcast('spaceChanged', context.space);
      }
    }
  }

  get currentUser(): User {
    return this.dummy.currentUser;
  }

  private addRecentContext(context: Context) {
    for (let i = this.recent.length - 1; i >= 0; i--) {
      if (this.recent[i].path === context.path) {
        this.recent.splice(i, 1);
      }
    }
    this.recent.unshift(context);
    // Truncate the context
    if (this.recent.length > this.RECENT_CONTEXT_LENGTH) {
      this.recent.splice(
        this.RECENT_CONTEXT_LENGTH,
        this.recent.length - this.RECENT_CONTEXT_LENGTH
      );
    }
    this.broadcaster.broadcast('save');
  }

  private buildContextMenus(context: Context) {
    if (typeof context.type === 'string') {
      context.type = this.lookupContextType(context.type);
    }
    if (context.type.menus) {
      for (let n of context.type.menus) {
        n.fullPath = this.buildPath(context.path, n.path);
        if (n.menus) {
          for (let o of n.menus) {
            o.fullPath = this.buildPath(context.path, n.path, o.path);
          }
        }
      }
    }
  }

  private computeContext(url: string): Context {
    // First, check if there is a recent context
    let entityStr: string = this.extractEntity();
    let spaceStr: string = this.extractSpace();
    // TODO Implement team URLs
    let teamStr: string = null;
    // The 'ctxPath' is the raw path to the context only, with all extraneous info removed
    let ctxPath = '';
    if (entityStr) {
      ctxPath = '/' + entityStr;
    }
    if (spaceStr) {
      ctxPath = ctxPath + '/' + spaceStr;
    }
    if (!ctxPath) {
      return null;
    }
    for (let c of this.recent) {
      if (c.path === ctxPath) {
        return c;
      }
    }

    // Otherwise, we have to build it
    return this.buildContext();
  }

  private buildContext() {
    let c: Context = {
      'entity': this.loadEntity(),
      'space': this.loadSpace(),
      'type': null,
      'name': null,
      'path': null
    } as Context;
    // TODO Support other types of entity
    if (c.entity && c.space) {
      c.type = 'space';
      c.path = '/' + (<User>c.entity).attributes.username + '/' + c.space.attributes.name;
      c.name = c.space.attributes.name;
    } else if (c.entity) {
      c.type = 'user';
      // TODO replace path with username once parameterized routes are working
      c.path = '/' + (<User>c.entity).attributes.username;
      c.name = (<User>c.entity).attributes.username;
    } // TODO add type detection for organization and team
    if (c.type != null) {
      this.buildContextMenus(c);
      return c;
    }
  }

  private extractEntity(): string {
    let params = this.getRouteParams();
    if (params) {
      return params["entity"];
    }
    return null;
  }

  private loadEntity(): Entity {
    return this.dummy.lookupEntity(this.extractEntity());
  }

  private extractSpace(): string {
    let params = this.getRouteParams();
    if (params) {
      return params["space"];
    }
    return null;
  }

  private getRouteParams(): any {
    if (this.router && this.router.routerState && this.router.routerState.snapshot && this.router.routerState.snapshot.root && this.router.routerState.snapshot.root.firstChild) {
      return this.router.routerState.snapshot.root.firstChild.params;
    }
    return null;
  }

  private loadSpace(): Space {
    return this.dummy.lookupSpace(this.extractSpace());
  }

  private buildPath(...args: string[]): string {
    let res = '';
    for (let p of args) {
      if (p.startsWith('/')) {
        res = p;
      } else {
        res = res + '/' + p;
      }
      res = res.replace(/\/*$/, '');
    }
    return res;
  }

}
