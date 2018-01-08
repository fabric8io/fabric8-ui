import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs';

import { LoginService } from './login.service';
import { Fabric8RuntimeConsoleService } from './runtime-console/fabric8-runtime-console.service';


// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected auth: AuthenticationService,
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService,
    private fabric8RuntimeConsoleService: Fabric8RuntimeConsoleService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.login.redirectToLogin(state.url);
      return Observable.of(false);
    } else {
      return this.fabric8RuntimeConsoleService.loadingOpenShiftToken();
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
