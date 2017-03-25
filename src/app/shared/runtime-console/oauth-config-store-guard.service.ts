import { OAuthConfigStore } from 'fabric8-runtime-console/src/app/kubernetes/store/oauth-config-store';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';


// Basic guard that checks the user is logged in

@Injectable()
export class OAuthConfigStoreGuard implements CanActivate, CanActivateChild {

  constructor(
    private store: OAuthConfigStore
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.store.loading
      // Wait until loaded
      .skipWhile(loading => loading)
      // Take the first false as done
      .first()
      // Invert, as we can now activate
      .map(loading => !loading);
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
