import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Observable, of as ObservableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as DetailWorkItemActions from './../actions/detail-work-item.actions';
import { WorkItemMapper, WorkItemService, WorkItemUI } from './../models/work-item';
import { WorkItemService as WIService } from './../services/work-item.service';
import { AppState } from './../states/app.state';
import { ErrorHandler, filterTypeWithSpace } from './work-item-utils';

export type Action = DetailWorkItemActions.All;

@Injectable()
export class DetailWorkItemEffects {
  private workItemMapper: WorkItemMapper = new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private errHandler: ErrorHandler,
  ) {}

  resolveWorkItems(
    workItems,
    state,
    matchingQuery: boolean = false,
    ancestors: string[] = [],
  ): WorkItemUI[] {
    const hasAncestors = !!ancestors.length;
    return workItems.map((wi: WorkItemService) => {
      const workItemUI = this.workItemMapper.toUIModel(wi);
      workItemUI.bold = matchingQuery;
      if (hasAncestors) {
        workItemUI.treeStatus =
          ancestors.findIndex((a) => a === workItemUI.id) > -1 ? 'expanded' : workItemUI.treeStatus;
        if (workItemUI.treeStatus === 'expanded') {
          workItemUI.childrenLoaded = true;
        }
      }
      let wid = this.workItemMapper.toDynamicUIModel(
        wi,
        state.workItemTypes.entities[workItemUI.type].dynamicfields,
      );
      return { ...workItemUI, ...wid };
    });
  }

  @Effect() getWorkItem$: Observable<Action> = this.actions$.pipe(
    filterTypeWithSpace(DetailWorkItemActions.GET_WORKITEM, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      const state = wp.state;
      const payload = wp.payload;
      const workItem = Object.keys(state.workItems.entities)
        .map((id) => state.workItems.entities[id])
        .find((w) => w.number === payload.number);
      // If work item found in the existing list
      if (workItem) {
        return ObservableOf(new DetailWorkItemActions.GetWorkItemSuccess(workItem));
      }
      // Else fetch it from the server
      const spaceName = state.space.attributes.name;
      const spaceOwner = state.space.relationalData.creator.attributes.username;
      return this.workItemService.getWorkItemByNumber(payload.number, spaceOwner, spaceName).pipe(
        map((data: WorkItemService) => {
          const wi = this.resolveWorkItems([data], state);
          return new DetailWorkItemActions.GetWorkItemSuccess(wi[0]);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            'Problem in getting work item.',
            new DetailWorkItemActions.GetWorkItemError(),
          ),
        ),
      );
    }),
  );
}
