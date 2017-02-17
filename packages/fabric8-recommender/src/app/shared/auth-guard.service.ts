import { LoginService } from './login.service';
import { AuthenticationService, Logger } from 'ngx-login-client';
import { ContextService } from './../shared/context.service';
import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

// Basic guard that checks the user is logged in

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    protected context: ContextService,
    protected auth: AuthenticationService,
    protected router: Router,
    protected logger: Logger,
    protected login: LoginService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.auth.isLoggedIn()) {
      this.logger.log('Please login to access ' + state.url);
      this.login.redirectUrl = state.url;
      this.logger.log('Setting redirect URL to ' + this.login.redirectUrl);
      this.router.navigate(['/public']);
      return false;
    } else {
      return true;
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }
}
