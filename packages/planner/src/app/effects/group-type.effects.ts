import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceQuery } from '../models/space';
import * as GroupTypeActions from './../actions/group-type.actions';
import { GroupTypeMapper, GroupTypeService } from './../models/group-types.model';
import { GroupTypesService as GTService } from './../services/group-types.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = GroupTypeActions.All;

@Injectable()
export class GroupTypeEffects {
  constructor(
    private actions$: Actions,
    private groupTypeService: GTService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getGroupTypes$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(GroupTypeActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.groupTypeService
        .getGroupTypes(space.relationships.workitemtypegroups.links.related)
        .pipe(
          map((types: GroupTypeService[]) => {
            const gtm = new GroupTypeMapper();
            return new GroupTypeActions.GetSuccess(types.map((t) => gtm.toUIModel(t)));
          }),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              `Problem in fetching grouptypes.`,
              new GroupTypeActions.GetError(),
            ),
          ),
        );
    }),
  );
}
