import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  RouterStateSnapshot
} from '@angular/router';

import { AuthenticationService } from 'ngx-login-client';

import { ContextService } from './context.service';
import { LoginService } from './login.service';

/**
 * A guard which checks that the owner of the resource is the same as the one
 * who is logged in. This will also fail if the user is not logged in.
 */
@Injectable()
export class OwnerGuard implements CanActivate, CanActivateChild {

  constructor(
    private authService: AuthenticationService,
    private contextService: ContextService,
    private loginService: LoginService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isLoggedIn()) {
      return this.contextService.viewingOwnContext();
    } else {
      this.loginService.redirectToLogin(state.url);
      return false;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
