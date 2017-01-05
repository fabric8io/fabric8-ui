import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Context } from './../models/context';
import { DummyService } from './../dummy/dummy.service';
import { Broadcaster } from '../shared/broadcaster.service';


/*
 * A shared service that manages the users current context. The users context is defined as the
 * entity (user or org) and space that they are operating on.
 * 
 */
@Injectable()
export class ContextService {

  public current: Context;
  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster
  ) {
    // Listen for any context refreshes requested by the app
    this.broadcaster.on<string>('refreshContext').subscribe(message => {
      this.computeContext();
    });
    // Compute the initial context
    this.computeContext();
  }

  private computeContext() {
    // Find the most specific context menu path and display it
    let c;
    for (let m of this.dummy.contexts) {
      if (this.router.url.startsWith(m.path)) {
        if (c == null || m.path.length > c.path.length) {
          c = m;
        }
      }
    }
    this.current = c || this.dummy.defaultContext;
    if (this.current.type.menus) {
      for (let n of this.current.type.menus) {
        n.fullPath = this.buildPath(this.current.path, n.path);
        if (n.menus) {
          for (let o of n.menus) {
            o.fullPath = this.buildPath(this.current.path, n.path, o.path);
            if (o.fullPath === this.router.url) {
              o.active = true;
              n.active = true;
            }
          }
        } else if (n.fullPath === this.router.url) {
          n.active = true;
        }
      }
    }
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
