import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Context } from 'ngx-fabric8-wit';
import { Observable, of, throwError as observableThrowError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { Navigation } from '../models/navigation';
import { ContextService } from './context.service';

@Injectable()
export class ContextResolver implements Resolve<Context> {
  constructor(private contextService: ContextService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Context> {
    // Resolve the context
    return this.contextService
      .changeContext(
        of({
          url: state.url,
          user: route.params['entity'],
          space: route.params['space'],
        } as Navigation),
      )
      .pipe(
        first(),
        catchError((err: any, caught: Observable<Context>) => {
          console.log(`Caught in resolver ${err}`);
          return observableThrowError(err);
        }),
      );
  }
}
