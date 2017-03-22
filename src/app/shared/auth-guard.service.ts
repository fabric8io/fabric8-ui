import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable } from 'rxjs';

import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { LoginService } from './login.service';


// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected auth: AuthenticationService,
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (!this.auth.isLoggedIn()) {
      this.login.redirectToLogin(state.url);
      return Observable.of(false);
    } else {
      return Observable.of(true);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
  }
}
