import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { empty, Observable, of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { cleanObject } from '../models/common.model';
import { FilterService } from '../services/filter.service';
import { AND, EQUAL } from '../services/query-keys';
import * as BoardUIActions from './../actions/board-ui.actions';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemMapper, WorkItemService, WorkItemUI } from './../models/work-item';
import { WorkItemService as WIService } from './../services/work-item.service';
import { AppState } from './../states/app.state';
import * as util from './work-item-utils';

export type Action = WorkItemActions.All | ColumnWorkItemActions.All | BoardUIActions.All;

@Injectable()
export class WorkItemEffects {
  private workItemMapper: WorkItemMapper = new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService,
    private errHandler: util.ErrorHandler,
    private notifications: Notifications,
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

  @Effect() addWorkItems$ = this.actions$.pipe(
    util.filterTypeWithSpace(WorkItemActions.ADD, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap(
      (
        op,
      ): Observable<
        WorkItemActions.GetChildren | WorkItemActions.AddSuccess | WorkItemActions.AddError
      > => {
        const payload = op.payload;
        const state = op.state;
        const createID = payload.createId;
        const workItem = payload.workItem;
        const parentId = payload.parentId;
        return this.workItemService.create(state.space.links.self + '/workitems', workItem).pipe(
          map((item) => {
            let itemUI = this.workItemMapper.toUIModel(item);
            let wid = this.workItemMapper.toDynamicUIModel(
              item,
              state.workItemTypes.entities[itemUI.type].dynamicfields,
            );
            itemUI.createId = createID;
            return { ...itemUI, ...wid };
          }),
          switchMap((w) =>
            util.workitemMatchesFilter(
              this.route.snapshot,
              this.filterService,
              this.workItemService,
              w,
              state.space.id,
            ),
          ),
          mergeMap((wItem) => {
            // If a child item is created
            if (parentId) {
              wItem.parentID = parentId;
              // TODO : solve the hack :: link the item
              const linkPayload = util.createLinkObject(
                parentId,
                wItem.id,
                '25c326a7-6d03-4f5a-b23b-86a9ee4171e9',
              );

              return this.workItemService
                .createLink(state.space.links.self.split('space')[0] + 'workitemlinks', {
                  data: linkPayload,
                })
                .pipe(
                  map(() => {
                    // for a normal (not a child) work item creation
                    // Add item success notification
                    const parent = state.workItems.entities[parentId];
                    if (!parent.childrenLoaded && parent.hasChildren) {
                      return new WorkItemActions.GetChildren(parent);
                    } else {
                      if (payload.openDetailPage) {
                        this.router.navigateByUrl(
                          document.location.pathname + '/detail/' + wItem.number,
                          { relativeTo: this.route },
                        );
                      }
                      return new WorkItemActions.AddSuccess(wItem);
                    }
                  }),
                );
            } else {
              let currentURL = document.location.pathname;
              let detailURL =
                currentURL.indexOf('/plan/query') > -1 ? currentURL.split('/plan/query')[0] : null;
              const routeURL = detailURL
                ? detailURL + '/plan/detail/' + wItem.number
                : currentURL + '/detail/' + wItem.number;
              if (payload.openDetailPage) {
                this.router.navigateByUrl(routeURL, { relativeTo: this.route });
              } else if (currentURL.indexOf('/plan/query') > -1) {
                try {
                  this.notifications.message({
                    message: `New Work Item #${wItem.number} created.`,
                    type: NotificationType.SUCCESS,
                  } as Notification);
                } catch (e) {
                  console.log('Work item is added.');
                }
                return empty();
              }
              return of(new WorkItemActions.AddSuccess(wItem));
            }
          }),
          catchError((err) =>
            this.errHandler.handleError(
              err,
              `Problem adding work item.`,
              new WorkItemActions.AddError(),
            ),
          ),
        );
      },
    ),
  );

  @Effect() getWorkItems$: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(WorkItemActions.GET, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      const payload = wp.payload;
      const state = wp.state;
      const spaceQuery = this.filterService.queryBuilder('space', EQUAL, state.space.id);
      const finalQuery = this.filterService.queryJoiner(payload.filters, AND, spaceQuery);
      return this.workItemService.getWorkItems(payload.pageSize, { expression: finalQuery }).pipe(
        map((data: any) => {
          let wis = [];
          let nextLink = data.nextLink ? data.nextLink : '';
          if (payload.isShowTree) {
            const ancestors = data.ancestorIDs;
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree, ancestors);
            const wiIncludes = this.resolveWorkItems(data.included, state, false, ancestors);
            return { workItems: [...wis, ...wiIncludes], nextLink: nextLink };
          } else {
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree);
          }
          return { workItems: [...wis], nextLink: nextLink };
        }),
        map((d) => new WorkItemActions.GetSuccess(d)),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem loading workitems.`,
            new WorkItemActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() getWorkItemChildren$: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(WorkItemActions.GET_CHILDREN, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      const parent = wp.payload;
      const state = wp.state;
      return this.workItemService.getChildren(parent.childrenLink).pipe(
        map((data: WorkItemService[]) => {
          const wis = this.resolveWorkItems(data, state)
            // resolve parent ID
            .map((w) => {
              w.parentID = parent.id;
              return w;
            });
          return [...wis];
        }),
        map((workItems: WorkItemUI[]) => {
          return new WorkItemActions.GetChildrenSuccess({
            parent: parent,
            children: workItems,
          });
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem loading children.`,
            new WorkItemActions.GetChildrenError(parent),
          ),
        ),
      );
    }),
  );

  @Effect() updateWorkItem$: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(WorkItemActions.UPDATE, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      let payload;
      if (wp.payload.type) {
        // This order must be followed
        // because baseType is needed for dynamic fields
        const dynamicPayload = this.workItemMapper.toDyanmicServiceModel(
          wp.payload,
          wp.state.workItemTypes.entities[wp.payload.type].dynamicfields,
        );
        const staticPayload = this.workItemMapper.toServiceModel(wp.payload);

        payload = cleanObject({
          ...staticPayload,
          ...{
            attributes: {
              ...staticPayload.attributes,
              ...dynamicPayload.attributes,
            },
          },
        });
      } else {
        payload = this.workItemMapper.toServiceModel(wp.payload);
      }
      const state = wp.state;
      return this.workItemService.update(payload).pipe(
        map((w) => this.resolveWorkItems([w], state)[0]),
        switchMap((w) =>
          util.workitemMatchesFilter(
            this.route.snapshot,
            this.filterService,
            this.workItemService,
            w,
            state.space.id,
          ),
        ),
        map((w) => {
          const item = state.workItems.entities[w.id];
          if (item) {
            w.treeStatus = item.treeStatus;
            w.childrenLoaded = item.childrenLoaded;
            w.parentID = item.parentID;
          }
          return w;
        }),
        map((workItem: WorkItemUI) => {
          return new WorkItemActions.UpdateSuccess(workItem);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in update Workitem.`,
            new WorkItemActions.UpdateError(),
          ),
        ),
      );
    }),
  );

  @Effect() Reorder: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(WorkItemActions.REORDER, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((op) => {
      const workitem = this.workItemMapper.toServiceModel(op.payload.workitem);
      return this.workItemService
        .reOrderWorkItem(
          op.state.space.links.self,
          workitem,
          op.payload.destinationWorkitemID,
          op.payload.direction,
        )
        .pipe(
          map((w) => this.resolveWorkItems([w], op.state)[0]),
          map((w) => {
            w.treeStatus = op.payload.workitem.treeStatus;
            w.bold = op.payload.workitem.bold;
            w.childrenLoaded = op.payload.workitem.childrenLoaded;
            w.parentID = op.state.workItems.entities[w.id].parentID;
            return w;
          }),
          map((w) => new WorkItemActions.UpdateSuccess(w)),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              `Problem in reorder Workitem.`,
              new WorkItemActions.UpdateError(),
            ),
          ),
        );
    }),
  );

  @Effect() updateWorkItemFromBoard: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(ColumnWorkItemActions.UPDATE, this.store.pipe(select('planner'))),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      const staticPayload = this.workItemMapper.toServiceModel(wp.payload.workItem);
      const payload = cleanObject(staticPayload, ['baseType']);
      return this.workItemService.update(payload).pipe(
        switchMap((workitem) => {
          let reorderPayload = wp.payload.reorder;
          reorderPayload.workitem.version = workitem.attributes['version'];
          const workItem = this.workItemMapper.toServiceModel(reorderPayload.workitem);
          return reorderPayload.direction
            ? this.workItemService.reOrderWorkItem(
                wp.state.space.links.self,
                workItem,
                reorderPayload.destinationWorkitemID,
                reorderPayload.direction,
              )
            : of(workitem);
        }),
        map((w) => {
          let wi = this.resolveWorkItems([w], wp.state)[0];
          return wi;
        }),
        switchMap((w: WorkItemUI) => {
          return [
            new WorkItemActions.UpdateSuccess(w),
            new ColumnWorkItemActions.UpdateSuccess({
              workItemId: w.id,
              prevColumnId: wp.payload.prevColumnId,
              newColumnIds: w.columnIds,
            }),
            new BoardUIActions.UnlockBoard(),
          ];
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(err, `Problem in updating WorkItem`, [
            new ColumnWorkItemActions.UpdateError({
              prevColumnId: wp.payload.prevColumnId,
              newColumnIds: wp.payload.workItem.columnIds,
            }),
            new BoardUIActions.UnlockBoard(),
          ]),
        ),
      );
    }),
  );

  @Effect() getMoreWorkItems$: Observable<Action> = this.actions$.pipe(
    util.filterTypeWithSpace(
      WorkItemActions.GET_MORE_WORKITEMS,
      this.store.pipe(select((state) => state.planner)),
    ),
    map(([action, state]) => {
      return {
        payload: action.payload,
        state: state,
      };
    }),
    switchMap((wp) => {
      const payload = wp.payload;
      const state = wp.state;
      if (state.workItems.nextLink == '') {
        return of(new WorkItemActions.GetMoreWorkItemsSuccess({ workItems: [], nextLink: '' }));
      }
      return this.workItemService.getMoreWorkItems(state.workItems.nextLink).pipe(
        map((data: any) => {
          let wis = [];
          let nextLink = data.nextLink ? data.nextLink : '';
          if (payload.isShowTree) {
            const ancestors = data.ancestorIDs;
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree, ancestors);
            const wiIncludes = this.resolveWorkItems(data.included, state, false, ancestors);
            return { workItems: [...wis, ...wiIncludes], nextLink };
          } else {
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree);
          }
          return { workItems: [...wis], nextLink };
        }),
        map((d) => new WorkItemActions.GetMoreWorkItemsSuccess(d)),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in fetching more workitems.`,
            new WorkItemActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() deleteWorkItem$: Observable<Action> = this.actions$.pipe(
    ofType(WorkItemActions.DELETE),
    switchMap((action: WorkItemActions.Delete) => {
      const workItem = this.workItemMapper.toServiceModel(action.payload);
      return this.workItemService.delete(workItem).pipe(
        map(() => {
          return new WorkItemActions.DeleteSuccess(action.payload);
        }),
        catchError((err: HttpErrorResponse) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in Deleting work item.`,
            new WorkItemActions.DeleteError(),
          ),
        ),
      );
    }),
  );
}
