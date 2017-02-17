import { LoginService } from './login.service';
import { AuthGuard } from './../shared/auth-guard.service';
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

@Injectable()
export class ContextCurrentUserAuthGuard
  extends AuthGuard
  implements CanActivate, CanActivateChild {

  constructor(
    context: ContextService,
    auth: AuthenticationService,
    router: Router,
    logger: Logger,
    login: LoginService
  ) {
    super(context, auth, router, logger, login);
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!super.canActivate(route, state)) {
      return false;
    } else if (this.context.current.entity !== this.context.currentUser) {
      this.logger.log('You cannot access another users settings');
      this.router.navigate(['/home']);
      return false;
    } else {
      return true;
    }
  }
}
