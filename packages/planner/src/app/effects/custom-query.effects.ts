import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceQuery } from '../models/space';
import * as CustomQueryActions from './../actions/custom-query.actions';
import { CustomQueryModel } from './../models/custom-query.model';
import { CustomQueryService } from './../services/custom-query.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = CustomQueryActions.All;

@Injectable()
export class CustomQueryEffects {
  constructor(
    private actions$: Actions,
    private customQueryService: CustomQueryService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() GetCustomQueries$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(CustomQueryActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.customQueryService.getCustomQueries(space.links.self + '/queries').pipe(
        map((types: CustomQueryModel[]) => {
          types = types.map((t) => {
            t['selected'] = false;
            return t;
          });
          return new CustomQueryActions.GetSuccess(types);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'Problem in fetching custom queries.',
            new CustomQueryActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() addCustomQuery$ = this.actions$.pipe(
    filterTypeWithSpace(CustomQueryActions.ADD, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      let payload = action.payload;
      return this.customQueryService.create(payload, space.links.self + '/queries').pipe(
        map((customQuery) => {
          customQuery['selected'] = true;
          let customQueryName = customQuery.attributes.title;
          if (customQueryName.length > 15) {
            customQueryName = customQueryName.slice(0, 15) + '...';
          }
          return new CustomQueryActions.AddSuccess(customQuery);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'There was some problem creating custom query.',
            new CustomQueryActions.AddError(),
          ),
        ),
      );
    }),
  );

  @Effect() deleteCustomQuery = this.actions$.pipe(
    filterTypeWithSpace(CustomQueryActions.DELETE, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.customQueryService
        .delete(space.links.self + '/queries/' + action.payload.id)
        .pipe(
          map(() => {
            return new CustomQueryActions.DeleteSuccess(action.payload);
          }),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              'There was some problem deleting custom query.',
              new CustomQueryActions.DeleteError(),
            ),
          ),
        );
    }),
  );
}
