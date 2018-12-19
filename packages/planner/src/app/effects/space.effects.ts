import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Spaces } from 'ngx-fabric8-wit';
import { Observable, of as ObservableOf } from 'rxjs';
import * as SpaceActions from './../actions/space.actions';

import {
  catchError,
  delay,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import * as AreaActions from './../actions/area.actions';
import * as BoardActions from './../actions/board.actions';
import * as CollaboratorActions from './../actions/collaborator.actions';
import * as CustomQueryActions from './../actions/custom-query.actions';
import * as FilterActions from './../actions/filter.actions';
import * as GroupTypeActions from './../actions/group-type.actions';
import * as InfotipActions from './../actions/infotip.actions';
import * as IterationActions from './../actions/iteration.actions';
import * as LabelActions from './../actions/label.actions';
import * as LinkTypeActions from './../actions/link-type.actions';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import { ErrorHandler } from './work-item-utils';

export type Action = SpaceActions.All;

@Injectable()
export class SpaceEffects {
  private attempt: number = 0;

  constructor(
    private actions$: Actions,
    private spaces: Spaces,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getSpace$: Observable<Action> = this.actions$.pipe(
    ofType(SpaceActions.GET),
    switchMap((action) => this.spaces.current),
    filter((space) => !!space),
    switchMap((space) => ObservableOf(new SpaceActions.GetSuccess(space))),
    catchError((err) =>
      this.errHandler.handleError(err, `Problem in getting space`, new SpaceActions.GetError()),
    ),
  );

  @Effect() getSpaceSuccess$: Observable<any> = this.actions$.pipe(
    ofType(SpaceActions.GET_SUCCESS),
    map((v) => v as any),
    filter((v) => !!v && !!v.payload),
    delay(this.attempt * 5000),
    tap(() => this.attempt++),
    distinctUntilChanged((x, y) => {
      if (x && y) {
        return x.payload.id === y.payload.id;
      }
      return false;
    }),
    switchMap(() => [
      new CollaboratorActions.Get(),
      new AreaActions.Get(),
      new FilterActions.Get(),
      new GroupTypeActions.Get(),
      new IterationActions.Get(),
      new LabelActions.Get(),
      new WorkItemTypeActions.Get(),
      new LinkTypeActions.Get(),
      new CustomQueryActions.Get(),
      new InfotipActions.Get(),
      new BoardActions.Get(),
    ]),
  );
}
