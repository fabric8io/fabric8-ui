import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as IterationActions from '.././actions/iteration.actions';
import { IterationService } from '.././services/iteration.service';
import { IterationMapper } from '../models/iteration.model';

import { catchError, map, switchMap } from 'rxjs/operators';
import { cleanObject, normalizeArray } from '../models/common.model';
import { SpaceQuery } from '../models/space';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

@Injectable()
export class IterationEffects {
  constructor(
    private actions$: Actions,
    private iterationService: IterationService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getIterations$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(IterationActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.iterationService.getIterations(space.relationships.iterations.links.related).pipe(
        map((iterations) => {
          const itMapper = new IterationMapper();
          return iterations.map((it) => itMapper.toUIModel(it));
        }),
        map((iterations) => new IterationActions.GetSuccess(normalizeArray(iterations))),
        catchError((err) =>
          this.errHandler.handleError(
            err,
            'Problem in Fetching Iterations',
            new IterationActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() addIteration$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(IterationActions.ADD, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      const itMapper = new IterationMapper();
      const iteration = itMapper.toServiceModel(action.payload.iteration);
      cleanObject(iteration, ['id']);
      const url = action.payload.parent
        ? action.payload.parent.link
        : space.relationships.iterations.links.related;
      return this.iterationService.createIteration(url, iteration).pipe(
        map((iteration) => {
          return itMapper.toUIModel(iteration);
        }),
        map((iteration) => {
          return new IterationActions.AddSuccess({
            iteration: iteration,
            parent: action.payload.parent ? action.payload.parent : null,
          });
        }),
        catchError((err) =>
          this.errHandler.handleError(
            err,
            'Problem in adding Iterations',
            new IterationActions.AddError(),
          ),
        ),
      );
    }),
  );

  @Effect() updateIteration$: Observable<Action> = this.actions$.pipe(
    ofType(IterationActions.UPDATE),
    switchMap((action: IterationActions.Update) => {
      const itMapper = new IterationMapper();
      const iteration = itMapper.toServiceModel(action.payload);
      return this.iterationService.updateIteration(iteration).pipe(
        map((iteration) => {
          return itMapper.toUIModel(iteration);
        }),
        map((iteration) => {
          return [new IterationActions.UpdateSuccess(iteration)];
        }),
        switchMap((res) => res),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `There was some problem updating the iteration.`,
            new IterationActions.UpdateError(),
          ),
        ),
      );
    }),
  );
}
