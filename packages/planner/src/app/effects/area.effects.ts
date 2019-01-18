import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { normalizeArray } from '../models/common.model';
import { SpaceQuery } from '../models/space';
import * as AreaActions from './../actions/area.actions';
import { AreaMapper, AreaService } from './../models/area.model';
import { AreaService as AService } from './../services/area.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = AreaActions.All;

@Injectable()
export class AreaEffects {
  constructor(
    private actions$: Actions,
    private areaService: AService,
    private errHandler: ErrorHandler,
    private spaceQuery: SpaceQuery,
  ) {}

  @Effect() getAreas$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(AreaActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.areaService.getAreas2(space.relationships.areas.links.related).pipe(
        map((areas: AreaService[]) => {
          const aMapper = new AreaMapper();
          return areas
            .map((a) => aMapper.toUIModel(a))
            .sort((a1, a2) => (a1.name.toLowerCase() > a2.name.toLowerCase() ? 1 : 0));
        }),
        map((areas) => new AreaActions.GetSuccess(normalizeArray(areas))),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'Problem in fetching Areas.',
            new AreaActions.GetError(),
          ),
        ),
      );
    }),
  );
}
