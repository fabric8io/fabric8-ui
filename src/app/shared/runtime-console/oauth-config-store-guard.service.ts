import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { Fabric8RuntimeConsoleService } from './fabric8-runtime-console.service';


// Basic guard that checks the user is logged in

@Injectable()
export class OAuthConfigStoreGuard implements CanActivate, CanActivateChild {

  constructor(
    private fabric8RuntimeConsole: Fabric8RuntimeConsoleService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.fabric8RuntimeConsole.loading();
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
