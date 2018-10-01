import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { Context } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { catchError, first, switchMap, take } from 'rxjs/operators';
import { Navigation } from '../models/navigation';
import { ContextService } from './context.service';

@Injectable()
export class ProfileResolver implements Resolve<Context> {

  constructor(private userService: UserService, private contextService: ContextService, private router: Router) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Context> {
    // Resolve the context
    return this.userService.loggedInUser.pipe(
      switchMap((userName) => {
        let url = state.url.replace(/_profile/, userName.attributes.username);
        return this.contextService
          .changeContext(of({
            url: url,
            user: userName.attributes.username,
            space: null
          } as Navigation))
          .pipe(
            first(),
            catchError((err: any, caught: Observable<Context>) => {
              console.log(`Caught in resolver ${err}`);
              return observableThrowError(err);
            })
          );
      })
    ).pipe(take(1));
  }

}
