import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { from as ObservableFrom, Observable } from 'rxjs';
import { catchError, map, switchMap, withLatestFrom } from 'rxjs/operators';
import { SpaceQuery } from '../models/space';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemLinkMapper } from './../models/link';
import { WorkItemQuery } from './../models/work-item';
import { WorkItemService } from './../services/work-item.service';
import { ErrorHandler } from './work-item-utils';

export type Action = WorkItemLinkActions.All;

@Injectable()
export class WorkItemLinkEffects {
  private wilMapper = new WorkItemLinkMapper();
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private workItemQuery: WorkItemQuery,
    private spaceQuery: SpaceQuery,
    private errHandler: ErrorHandler,
  ) {}

  @Effect() getLinks$: Observable<Action> = this.actions$.pipe(
    ofType<WorkItemLinkActions.Get>(WorkItemLinkActions.GET),

    map((action) => action.payload),
    switchMap((payload) => {
      return this.workItemService.resolveLinks(payload).pipe(
        map(([links, includes]) => {
          return links.map((link) => {
            link.relationships.link_type.data = includes.find(
              (i) => i.id === link.relationships.link_type.data.id,
            );
            link.relationships.source.data = includes.find(
              (i) => i.id === link.relationships.source.data.id,
            );
            link.relationships.target.data = includes.find(
              (i) => i.id === link.relationships.target.data.id,
            );
            return link;
          });
        }),
        map((links) => {
          return new WorkItemLinkActions.GetSuccess(links.map((l) => this.wilMapper.toUIModel(l)));
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem in fetching links.`,
            new WorkItemLinkActions.GetError(),
          ),
        ),
      );
    }),
  );

  @Effect() createLink$: Observable<Action | WorkItemActions.CreateLink> = this.actions$.pipe(
    ofType<WorkItemLinkActions.Add>(WorkItemLinkActions.ADD),
    withLatestFrom(this.workItemQuery.getWorkItemEntities),
    withLatestFrom(this.spaceQuery.getCurrentSpace),
    map(([[action, workItems], space]) => {
      return {
        payload: action.payload,
        workItems: workItems,
        space: space,
      };
    }),
    switchMap((p) => {
      let createLinkPayload = { data: p.payload };
      return this.workItemService
        .createLink(p.space.links.self.split('space')[0] + 'workitemlinks', createLinkPayload)
        .pipe(
          switchMap(([link, includes]) => {
            link.relationships.link_type.data = includes.find(
              (i) => i.id === link.relationships.link_type.data.id,
            );
            link.relationships.source.data = includes.find(
              (i) => i.id === link.relationships.source.data.id,
            );
            link.relationships.target.data = includes.find(
              (i) => i.id === link.relationships.target.data.id,
            );
            let sourceWorkItem;
            let targetWorkItem;
            let returnActions = [];
            // the tree will updated
            // only if it is parent-child relationship
            if (
              link.relationships['link_type'].data.id === '25c326a7-6d03-4f5a-b23b-86a9ee4171e9'
            ) {
              if (p.workItems[p.payload.relationships.source.data.id]) {
                sourceWorkItem = p.workItems[p.payload.relationships.source.data.id];
              }
              if (p.workItems[p.payload.relationships.target.data.id]) {
                targetWorkItem = p.workItems[p.payload.relationships.target.data.id];
              }
              if (
                p.workItems[p.payload.relationships.source.data.id] &&
                p.workItems[p.payload.relationships.target.data.id]
              ) {
                returnActions.push(
                  new WorkItemActions.CreateLink({
                    source: sourceWorkItem,
                    target: targetWorkItem,
                    sourceTreeStatus: sourceWorkItem.treeStatus,
                  }),
                );
              }
            }
            const linkUIValue = {
              ...this.wilMapper.toUIModel(link),
              ...{ newlyAdded: true },
            };
            returnActions.push(new WorkItemLinkActions.AddSuccess(linkUIValue));
            return ObservableFrom(returnActions);
          }),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              `Problem in creating link`,
              new WorkItemLinkActions.AddError(),
            ),
          ),
        );
    }),
  );

  @Effect() deleteLink$: Observable<Action | WorkItemActions.DeleteLink> = this.actions$.pipe(
    ofType<WorkItemLinkActions.Delete>(WorkItemLinkActions.DELETE),
    withLatestFrom(this.workItemQuery.getWorkItemEntities),
    withLatestFrom(this.spaceQuery.getCurrentSpace),
    map(([[action, workItems], space]) => {
      return {
        payload: action.payload,
        workItems: workItems,
        space: space,
      };
    }),
    switchMap((p) => {
      let wiLink = this.wilMapper.toServiceModel(p.payload.wiLink);
      return this.workItemService
        .deleteLink(`${p.space.links.self.split('space')[0]}workitemlinks/${wiLink.id}`)
        .pipe(
          switchMap((response) => {
            let targetWorkItem;
            let sourceWorkItem;
            if (p.workItems[p.payload.wiLink.target.id]) {
              targetWorkItem = p.workItems[p.payload.wiLink.target.id];
            }
            if (p.workItems[p.payload.wiLink.source.id]) {
              sourceWorkItem = p.workItems[p.payload.wiLink.source.id];
            }

            return [
              new WorkItemLinkActions.DeleteSuccess(p.payload.wiLink),
              new WorkItemActions.DeleteLink({
                source: sourceWorkItem,
                target: targetWorkItem,
                sourceTreeStatus: '',
              }),
            ];
          }),
          catchError((err) =>
            this.errHandler.handleError<Action>(
              err,
              `Problem in deleting work item Link`,
              new WorkItemLinkActions.DeleteError(),
            ),
          ),
        );
    }),
  );
}
