import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable, of as ObservableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceQuery } from '../models/space';
import * as LabelActions from './../actions/label.actions';
import { LabelMapper } from './../models/label.model';
import { LabelService } from './../services/label.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = LabelActions.All;

@Injectable()
export class LabelEffects {
  constructor(
    private actions$: Actions,
    private labelService: LabelService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getLabels$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(LabelActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.labelService.getLabels(space.links.self + '/labels').pipe(
        map((labels) => {
          const lMapper = new LabelMapper();
          return labels.map((l) => lMapper.toUIModel(l));
        }),
        map((labels) => new LabelActions.GetSuccess(labels)),
        catchError((err) => ObservableOf(new LabelActions.GetError())),
      );
    }),
  );

  @Effect() createLabel$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(LabelActions.ADD, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.labelService.createLabel(action.payload, space.links.self + '/labels').pipe(
        map((label) => {
          const lMapper = new LabelMapper();
          let labelUI = lMapper.toUIModel(label);
          return new LabelActions.AddSuccess(labelUI);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `There was some problem in adding the label.`,
            new LabelActions.AddError(),
          ),
        ),
      );
    }),
  );
}
