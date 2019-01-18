import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { UserService } from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState } from './../states/app.state';
import { AreaModel, AreaQuery, AreaUI } from './area.model';
import { Mapper, MapTree, modelService, switchModel } from './common.model';
import { IterationModel, IterationQuery, IterationUI } from './iteration.model';
import { LabelModel, LabelQuery, LabelUI } from './label.model';
import { UserQuery, UserUI } from './user';
import { WorkItemType, WorkItemTypeQuery, WorkItemTypeUI } from './work-item-type';

export class Event extends modelService {
  attributes: EventAttributes;
  relationships: EventRelationships;
}

export class EventAttributes {
  name: string;
  newValue?: string | null | any[];
  oldValue?: string | null | any[];
  timestamp: string;
}

export class EventRelationships {
  modifier: {
    data: {
      id: string;
      links: {
        related: string;
      };
      type: string;
    };
  };
  newValue?: {
    data?: AreaModel[] | IterationModel[] | WorkItemType[] | UserService[] | LabelModel[];
  };
  oldValue?: {
    data?: AreaModel[] | IterationModel[] | WorkItemType[] | UserService[] | LabelModel[];
  };
}

export interface EventUI {
  name: string;
  timestamp: string;
  newValue: string | null;
  oldValue: string | null;
  modifierId: string;
  modifier?: Observable<UserUI>;
  newValueRelationships: any;
  oldValueRelationships: any;
  newValueRelationshipsObs?:
    | Observable<IterationUI | AreaUI | WorkItemTypeUI | UserUI>[]
    | Observable<LabelUI[]>;
  oldValueRelationshipsObs?:
    | Observable<IterationUI | AreaUI | WorkItemTypeUI | UserUI>[]
    | Observable<LabelUI[]>;
  type: string | null;
}

export interface EventService extends Event {}

export class EventMapper implements Mapper<EventService, EventUI> {
  constructor() {}

  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['attributes', 'name'],
      toPath: ['name'],
    },
    {
      fromPath: ['attributes', 'newValue'],
      toPath: ['newValue'],
      toFunction: (newValue) => {
        if (newValue !== null) {
          if (Array.isArray(newValue)) {
            return newValue.join(', ');
          } else {
            return newValue;
          }
        } else {
          return newValue;
        }
      },
    },
    {
      fromPath: ['attributes', 'oldValue'],
      toPath: ['oldValue'],
      toFunction: (oldValue) => {
        if (oldValue !== null) {
          if (Array.isArray(oldValue)) {
            return oldValue.join(', ');
          } else {
            return oldValue;
          }
        } else {
          return oldValue;
        }
      },
    },
    {
      fromPath: ['attributes', 'timestamp'],
      toPath: ['timestamp'],
    },
    {
      fromPath: ['relationships', 'modifier', 'data', 'id'],
      toPath: ['modifierId'],
    },
    {
      fromPath: ['relationships', 'newValue'],
      toPath: ['newValueRelationships'],
      toFunction: (newValue) => {
        if (newValue !== null) {
          if (newValue.hasOwnProperty('data')) {
            return newValue['data'].map((item) => {
              return {
                id: item.id,
                type: item.type,
              };
            });
          } else {
            return [];
          }
        } else {
          return [];
        }
      },
    },
    {
      fromPath: ['relationships', 'oldValue'],
      toPath: ['oldValueRelationships'],
      toFunction: (oldValue) => {
        if (oldValue !== null) {
          if (oldValue.hasOwnProperty('data')) {
            return oldValue['data'].map((item) => {
              return {
                id: item.id,
                type: item.type,
              };
            });
          } else {
            return [];
          }
        } else {
          return [];
        }
      },
    },
    {
      toPath: ['type'],
      toValue: null,
    },
  ];
  uiToServiceMapTree: MapTree;

  toUIModel(arg: EventService): EventUI {
    return switchModel<EventService, EventUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: EventUI): EventService {
    return switchModel<EventUI, EventService>(arg, this.uiToServiceMapTree);
  }
}

@Injectable()
export class EventQuery {
  private eventSource: Observable<EventUI[]> = this.store.pipe(
    select((state) => state.detailPage),
    select((state) => state.events),
  );

  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private iterationQuery: IterationQuery,
    private areaQuery: AreaQuery,
    private labelQuery: LabelQuery,
    private workitemTypeQuery: WorkItemTypeQuery,
  ) {}

  getEventsWithModifier(): Observable<EventUI[]> {
    return this.eventSource.pipe(
      map((events) => {
        return events.map((event) => {
          switch (event.type) {
            case 'iterations':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map((item) => {
                  return this.iterationQuery.getIterationObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map((item) => {
                  return this.iterationQuery.getIterationObservableById(item.id);
                }),
              };
            case 'areas':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map((item) => {
                  return this.areaQuery.getAreaObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map((item) => {
                  return this.areaQuery.getAreaObservableById(item.id);
                }),
              };
            case 'users':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map((item) => {
                  return this.userQuery.getUserObservableById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map((item) => {
                  return this.userQuery.getUserObservableById(item.id);
                }),
              };

            case 'labels':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: this.labelQuery.getLabelObservablesByIds(
                  event.newValueRelationships.map((i) => i.id),
                ),
                oldValueRelationshipsObs: this.labelQuery.getLabelObservablesByIds(
                  event.oldValueRelationships.map((i) => i.id),
                ),
              };

            case 'workitemtypes':
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
                newValueRelationshipsObs: event.newValueRelationships.map((item) => {
                  return this.workitemTypeQuery.getWorkItemTypeById(item.id);
                }),
                oldValueRelationshipsObs: event.oldValueRelationships.map((item) => {
                  return this.workitemTypeQuery.getWorkItemTypeById(item.id);
                }),
              };
            default:
              console.log('Unknown event: ', event);
              return {
                ...event,
                modifier: this.userQuery.getUserObservableById(event.modifierId),
              };
          }
        });
      }),
    );
  }
}
