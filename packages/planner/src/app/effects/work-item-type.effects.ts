import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpaceQuery } from '../models/space';
import * as WIStateActions from './../actions/work-item-state.actions';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import { WorkItemTypeMapper, WorkItemTypeService } from './../models/work-item-type';
import { WorkItemService } from './../services/work-item.service';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = WorkItemTypeActions.All | WIStateActions.All;

@Injectable()
export class WorkItemTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getWorkItemTypes$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(WorkItemTypeActions.GET, this.spaceQuery.getCurrentSpace),
    switchMap(([action, space]) => {
      return this.workItemService
        .getWorkItemTypes(space.relationships.workitemtypes.links.related)
        .pipe(
          map((types) => types.filter((t) => t.attributes['can-construct'])),
          switchMap((types: WorkItemTypeService[]) => {
            const witm = new WorkItemTypeMapper();
            const wiTypes = types.map((t) => witm.toUIModel(t));
            return [
              new WorkItemTypeActions.GetSuccess(wiTypes),
              new WIStateActions.GetSuccess(types),
            ];
          }),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              `Problem in fetching workitem type.`,
              new WorkItemTypeActions.GetError(),
            ),
          ),
        );
    }),
  );
}
