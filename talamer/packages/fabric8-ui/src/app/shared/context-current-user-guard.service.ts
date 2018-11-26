import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  NavigationEnd,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Contexts } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { combineLatest ,  Observable } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable()
export class ContextCurrentUserGuard implements Resolve<any> {

  private _lastRoute: string;

  constructor(
    private contexts: Contexts,
    private router: Router,
    private userService: UserService,
    private notifications: Notifications
  ) {
    // The default place to navigate to if the context cannot be resolved is /home
    this._lastRoute = '/_home';
    // Store the last visited URL so we can navigate back if the context
    // cannot be resolved
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: NavigationEnd) => e.urlAfterRedirects)
    ).subscribe(val => this._lastRoute = val);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return combineLatest(
      this.contexts.current.pipe(
        map(val => val.user.id)
      ),
      this.userService.loggedInUser.pipe(
        map(val => val.id)
      ),
      (a, b) => (a === b)
    ).pipe(
      tap(val => {
        if (!val) {
          this.notifications.message({
            message: `You cannot access ${state.url}`,
            type: NotificationType.WARNING
          } as Notification);
        }
      }),
      map(val => {
        if (val) {
          return true;
        } else {
          this.router.navigateByUrl(this._lastRoute);
          return false;
        }
      }),
      first()
    );
  }
}
