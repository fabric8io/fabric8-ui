import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as InfotipActions from './../actions/infotip.actions';
import { InfotipService } from './../services/infotip.service';
import { ErrorHandler } from './work-item-utils';

export type Action = InfotipActions.All;

@Injectable()
export class InfotipEffects {
  constructor(
    private actions$: Actions,
    private infotipService: InfotipService,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getInfotips$: Observable<Action> = this.actions$.pipe(
    ofType<InfotipActions.Get>(InfotipActions.GET),
    switchMap((action) => {
      return this.infotipService.getInfotips().pipe(
        map((payload) => new InfotipActions.GetSuccess(payload)),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'Problem in fetching InfoTips',
            new InfotipActions.GetError(),
          ),
        ),
      );
    }),
  );
}
