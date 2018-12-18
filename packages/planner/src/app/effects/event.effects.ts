import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { EventMapper, EventService, EventUI } from '../models/event.model';
import * as EventActions from './../actions/event.action';
import { WorkItemService } from './../services/work-item.service';
import { ErrorHandler } from './work-item-utils';

export type Action = EventActions.All;

@Injectable()
export class EventEffects {
  private eventMapper: EventMapper = new EventMapper();
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private errHandler: ErrorHandler,
  ) {}

  resolveEvents(events) {
    return events.map((event: EventService) => {
      let eventUI = this.eventMapper.toUIModel(event);
      if (eventUI.newValueRelationships && eventUI.oldValueRelationships) {
        let added = eventUI.newValueRelationships.filter(
          (newItem) =>
            eventUI.oldValueRelationships.findIndex((oldItem) => oldItem.id === newItem.id) === -1,
        );
        let removed = eventUI.oldValueRelationships.filter(
          (oldItem) =>
            eventUI.newValueRelationships.findIndex((newItem) => newItem.id === oldItem.id) === -1,
        );
        eventUI.newValueRelationships = added;
        eventUI.oldValueRelationships = removed;
        if (eventUI.newValueRelationships.length > 0) {
          eventUI.type = eventUI.newValueRelationships[0].type;
        } else if (eventUI.oldValueRelationships.length > 0) {
          eventUI.type = eventUI.oldValueRelationships[0].type;
        }
      }
      return { ...eventUI };
    });
  }

  @Effect() getWorkItemEvents$: Observable<Action> = this.actions$.pipe(
    ofType<EventActions.Get>(EventActions.GET),
    switchMap((p) => {
      return this.workItemService.getEvents(p.payload).pipe(
        map((resp) => {
          let events = resp.filter((event) => event !== null).reverse();
          return this.resolveEvents(events);
        }),
        map((events: EventUI[]) => {
          return new EventActions.GetSuccess(events);
        }),
        catchError((err) =>
          this.errHandler.handleError<Action>(
            err,
            `Problem loading Events.`,
            new EventActions.GetError(),
          ),
        ),
      );
    }),
  );
}
