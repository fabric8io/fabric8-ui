import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as FilterActions from './../actions/filter.actions';
import { FilterModel } from './../models/filter.model';
import { SpaceQuery } from './../models/space';
import { FilterService } from './../services/filter.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = FilterActions.All;

@Injectable()
export class FilterEffects {
  constructor(
    private actions$: Actions,
    private filterService: FilterService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() GetFilters$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(FilterActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.filterService.getFilters(space.links.filters).pipe(
        map((types: FilterModel[]) => {
          return new FilterActions.GetSuccess(types);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'Problem in fetching filters.',
            new FilterActions.GetError(),
          ),
        ),
      );
    }),
  );
}
