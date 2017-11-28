import { Injectable, OnDestroy } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import { Observable, Subscription } from 'rxjs';

import { AuthenticationService, UserService, User } from 'ngx-login-client';

import { LoginService } from './login.service';

/**
 * A guard which checks that the owner of the resource is the same as the one
 * who is logged in. This will also fail if the user is not logged in, making
 * it a superset of the AuthGuard service.
 */
@Injectable()
export class OwnerGuard implements OnDestroy {
  private subscription: Subscription;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
    private userService: UserService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    if (this.authService.isLoggedIn()) {
      return Observable.create(observer => {
        this.subscription = this.userService.loggedInUser.subscribe(user => {
          observer.next(this.userMatchesOwnerFromRoute(user));
        });
      });
    } else {
      this.loginService.redirectToLogin(state.url);
      return Observable.of(false);
    }
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.canActivate(route, state);
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

  private extractUserFromRoute(): string {
    let params = this.getRouteParams();
    if (params && params['entity']) {
      return decodeURIComponent(params['entity']);
    }
    return null;
  }

  private userMatchesOwnerFromRoute(user: User): boolean {
    return user &&
           user.attributes &&
           user.attributes.username &&
           user.attributes.username === this.extractUserFromRoute();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
