import { Injectable } from '@angular/core';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'workItemSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
  select,
  Store,
} from '@ngrx/store';
import { cloneDeep, orderBy } from 'lodash';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AppState, DetailPageState, PlannerState } from './../states/app.state';
import { AreaModel, AreaQuery, AreaUI } from './area.model';
import { Comment, CommentUI } from './comment';
import {
  cleanObject,
  CommonSelectorUI,
  Mapper,
  MapTree,
  modelService,
  switchModel,
} from './common.model';
import { IterationModel, IterationQuery, IterationUI } from './iteration.model';
import { LabelMapper, LabelModel, LabelQuery, LabelUI } from './label.model';
import { Link } from './link';
import { plannerSelector } from './space';
import { UserQuery, UserService, UserUI } from './user';
import {
  WorkItemType,
  WorkItemTypeMapper,
  WorkItemTypeQuery,
  workItemTypeSelector,
  WorkItemTypeUI,
} from './work-item-type';

export class WorkItem extends modelService {
  hasChildren?: boolean;
  attributes: object = {};
  number?: number;
  relationships?: WorkItemRelations;
  relationalData?: RelationalData;
  links?: {
    self: string;
  };
}

export class WorkItemRelations {
  area?: {
    data?: AreaModel;
  };
  assignees?: {
    data?: UserService[];
  };
  labels?: {
    data?: LabelModel[];
    links?: {
      related?: string;
    };
  };
  baseType?: {
    data: WorkItemType;
  };
  parent?: {
    data?: WorkItem;
  };
  children?: {
    links: {
      related: string;
    };
    meta: {
      hasChildren: boolean;
    };
  };
  events?: {
    links?: {
      related?: string;
    };
  };
  comments?: {
    data?: Comment[];
    links: {
      self?: string;
      related?: string;
    };
    meta?: {
      totalCount?: number;
    };
  };
  creator?: {
    data: UserService;
  };
  iteration?: {
    data?: IterationModel;
  };
  codebase?: {
    links: {
      meta: {
        edit: string;
      };
    };
  };
  workItemLinks?: {
    links?: {
      related?: string;
    };
  };
}

export class RelationalData {
  area?: AreaModel;
  creator?: UserService;
  comments?: Comment[];
  parent?: WorkItem;
  assignees?: UserService[];
  labels?: LabelModel[];
  linkDicts?: LinkDict[];
  iteration?: IterationModel;
  totalLinkCount?: number;
  wiType?: WorkItemType;
}

export class LinkDict {
  linkName: any;
  links: Link[];
  count: number;
}

export interface WorkItemService extends WorkItem {}

export interface WorkItemUI {
  id: string;
  title: string;
  number: string | number;
  createdAt: string;
  updatedAt: string;
  state: string;
  descriptionMarkup: string;
  descriptionRendered: string;
  description: string | { content: string; markup: 'Markdown'; rendered?: string };
  version: number;
  order: number;
  dynamicfields?: any;

  areaId: string;
  areaObs?: Observable<AreaUI>;
  iterationId: string;
  iterationObs?: Observable<IterationUI>;
  assignees: string[];
  assigneesObs?: Observable<UserUI[]>;
  creator: string;
  creatorObs?: Observable<UserUI>;
  type: string;
  typeObs?: Observable<WorkItemTypeUI>;
  labels: string[];
  labelsObs?: Observable<LabelUI[]>;
  comments?: CommentUI[];
  children?: WorkItemUI[];
  commentLink: string;
  childrenLink: string;
  eventLink: string;
  hasChildren: boolean;
  parentID: string;
  link: string;
  WILinkUrl: string;
  columnIds?: string[] | null;

  treeStatus: 'collapsed' | 'expanded' | 'disabled' | 'loading'; // collapsed
  childrenLoaded: boolean; // false
  bold: boolean; // false

  createId?: number; // this is used to identify newly created item
  selected: boolean;
  editable?: boolean; // Based on the logged in user this value will be changed. Default value is false
}

export interface WorkItemStateModel extends EntityState<WorkItemUI> {
  nextLink: string;
}

const workItemAdapter = createEntityAdapter<WorkItemUI>();
const { selectIds, selectEntities, selectAll, selectTotal } = workItemAdapter.getSelectors();

export class WorkItemMapper implements Mapper<WorkItemService, WorkItemUI> {
  wiTypeMapper = new WorkItemTypeMapper();
  labelMapper = new LabelMapper();
  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['attributes', 'system.title'],
      toPath: ['title'],
    },
    {
      fromPath: ['attributes', 'system.number'],
      toPath: ['number'],
    },
    {
      fromPath: ['attributes', 'system.order'],
      toPath: ['order'],
    },
    {
      fromPath: ['attributes', 'system.created_at'],
      toPath: ['createdAt'],
    },
    {
      fromPath: ['attributes', 'system.updated_at'],
      toPath: ['updatedAt'],
    },
    {
      fromPath: ['attributes', 'system.state'],
      toPath: ['state'],
    },
    {
      fromPath: ['attributes', 'system.description.markup'],
      toPath: ['descriptionMarkup'],
    },
    {
      fromPath: ['attributes', 'system.description.rendered'],
      toPath: ['descriptionRendered'],
    },
    {
      fromPath: ['attributes', 'system.description'],
      toPath: ['description'],
    },
    {
      fromPath: ['attributes', 'version'],
      toPath: ['version'],
    },
    {
      fromPath: ['links', 'self'],
      toPath: ['link'],
    },
    {
      fromPath: ['relationships', 'workItemLinks', 'links', 'related'],
      toPath: ['WILinkUrl'],
    },
    {
      fromPath: ['relationships', 'area', 'data', 'id'],
      toPath: ['areaId'],
    },
    {
      fromPath: ['relationships', 'creator', 'data', 'id'],
      toPath: ['creator'],
    },
    {
      fromPath: ['relationships', 'iteration', 'data', 'id'],
      toPath: ['iterationId'],
    },
    {
      fromPath: ['relationships', 'baseType', 'data', 'id'],
      toPath: ['type'],
    },
    {
      fromPath: ['relationships', 'comments', 'links', 'related'],
      toPath: ['commentLink'],
    },
    {
      fromPath: ['relationships', 'events', 'links', 'related'],
      toPath: ['eventLink'],
    },
    {
      fromPath: ['relationships', 'assignees', 'data'],
      toPath: ['assignees'],
      toFunction: function(assignees: UserService[]) {
        if (!assignees) {
          return [];
        }
        return assignees.map((assignee) => assignee.id);
      },
    },
    {
      fromPath: ['relationships', 'labels', 'data'],
      toPath: ['labels'],
      toFunction: function(labels: LabelModel[]) {
        if (!labels) {
          return [];
        }
        return labels.map((label) => label.id);
      },
    },
    {
      toPath: ['children'],
      toValue: [],
    },
    {
      fromPath: ['relationships', 'children', 'meta', 'hasChildren'],
      toPath: ['hasChildren'],
    },
    {
      fromPath: ['relationships', 'parent', 'data', 'id'],
      toPath: ['parentID'],
    },
    {
      fromPath: ['relationships', 'children', 'links', 'related'],
      toPath: ['childrenLink'],
    },
    {
      fromPath: ['relationships', 'children', 'meta', 'hasChildren'],
      toPath: ['treeStatus'],
      toFunction: (hasChildren) => {
        if (!hasChildren) {
          return 'disabled';
        } else {
          return 'collapsed';
        }
      },
    },
    {
      toPath: ['childrenLoaded'],
      toValue: false,
    },
    {
      toPath: ['bold'],
      toValue: false,
    },
    {
      toPath: ['editable'],
      toValue: false,
    },
    {
      fromPath: ['relationships', 'boardcolumns', 'data'],
      toPath: ['columnIds'],
      toFunction: (data) => {
        return Array.isArray(data) ? data.map((col) => col.id) : null;
      },
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      toPath: ['id'],
      fromPath: ['id'],
    },
    {
      fromPath: ['title'],
      toPath: ['attributes', 'system.title'],
    },
    {
      fromPath: ['number'],
      toPath: ['attributes', 'system.number'],
    },
    {
      fromPath: ['order'],
      toPath: ['attributes', 'system.order'],
    },
    {
      fromPath: ['createdAt'],
      toPath: ['attributes', 'system.created_at'],
    },
    {
      fromPath: ['updatedAt'],
      toPath: ['attributes', 'system.updated_at'],
    },
    {
      fromPath: ['state'],
      toPath: ['attributes', 'system.state'],
    },
    {
      fromPath: ['descriptionRendered'],
      toPath: ['attributes', 'system.description.rendered'],
    },
    {
      fromPath: ['description'],
      toPath: ['attributes', 'system.description'],
    },
    {
      fromPath: ['description'],
      toPath: ['attributes', 'system.description.markup'],
      toFunction: (val) => {
        if (val) {
          return 'Markdown';
        }
        return null;
      },
    },
    {
      fromPath: ['version'],
      toPath: ['attributes', 'version'],
    },
    {
      fromPath: ['link'],
      toPath: ['links', 'self'],
    },
    {
      fromPath: ['WILinkUrl'],
      toPath: ['relationships', 'workItemLinks', 'links', 'related'],
    },
    {
      fromPath: ['areaId'],
      toPath: ['relationships', 'area', 'data', 'id'],
    },
    {
      toPath: ['relationships', 'area', 'data', 'type'],
      toValue: 'areas',
    },
    {
      fromPath: ['creator'],
      toPath: ['relationships', 'creator', 'data', 'id'],
    },
    {
      toPath: ['relationships', 'creator', 'data', 'type'],
      toValue: 'identities',
    },
    {
      fromPath: ['iterationId'],
      toPath: ['relationships', 'iteration', 'data'],
      toFunction: (id: string) => {
        return {
          id: id,
          type: 'iterations',
        };
      },
    },
    {
      fromPath: ['type'],
      toPath: ['relationships', 'baseType', 'data', 'id'],
    },
    {
      toPath: ['relationships', 'baseType', 'data', 'type'],
      toValue: 'workitemtypes',
    },
    {
      fromPath: ['commentLink'],
      toPath: ['relationships', 'comments', 'links', 'related'],
    },
    {
      fromPath: ['eventLink'],
      toPath: ['relationships', 'events', 'links', 'related'],
    },
    {
      fromPath: ['assignees'],
      toPath: ['relationships', 'assignees', 'data'],
      toFunction: function(assignees: string[]) {
        if (!assignees) {
          return null;
        }
        return assignees.map((assigneeId) => {
          return {
            id: assigneeId,
            type: 'identities',
          };
        });
      },
    },
    {
      fromPath: ['labels'],
      toPath: ['relationships', 'labels', 'data'],
      toFunction: function(labels: LabelUI[]) {
        if (!labels) {
          return null;
        }
        return labels.map((label) =>
          cleanObject(this.labelMapper.toServiceModel({ id: label }), [
            'attributes',
            'links',
            'relationships',
          ]),
        );
      }.bind(this),
    },
    {
      toPath: ['relationships', 'boardcolumns', 'data'],
      fromPath: ['columnIds'],
      toFunction: (data) => {
        if (!data) {
          return null;
        }
        return data.map((id) => {
          return {
            id: id,
            type: 'boardcolumns',
          };
        });
      },
    },
    {
      fromPath: ['hasChildren'],
      toPath: ['relationships', 'children', 'meta', 'hasChildren'],
    },
    {
      fromPath: ['parentID'],
      toPath: ['relationships', 'parent', 'data', 'id'],
    },
    {
      fromPath: ['childrenLink'],
      toPath: ['relationships', 'children', 'links', 'related'],
    },
    {
      toPath: ['type'],
      toValue: 'workitems',
    },
  ];

  toDynamicUIModel(arg: WorkItemService, dynamicFields) {
    let serviceToDyanmicUiMapTree: MapTree = [];
    for (let i = 0; i < dynamicFields.length; i++) {
      serviceToDyanmicUiMapTree.push({
        toPath: ['dynamicfields', dynamicFields[i]],
        fromPath: ['attributes', dynamicFields[i]],
      });
    }
    return switchModel<WorkItemService, any>(arg, serviceToDyanmicUiMapTree);
  }

  toDyanmicServiceModel(arg: WorkItemUI, dynamicFields) {
    let dynamicUiToServiceMapTree: MapTree = [];
    for (let i = 0; i < dynamicFields.length; i++) {
      dynamicUiToServiceMapTree.push({
        toPath: ['attributes', dynamicFields[i]],
        fromPath: ['dynamicfields', dynamicFields[i]],
      });
    }
    const serviceModel = switchModel<WorkItemUI, any>(arg, dynamicUiToServiceMapTree);
    return cleanObject(serviceModel);
  }

  toUIModel(arg: WorkItemService): WorkItemUI {
    return switchModel<WorkItemService, WorkItemUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: WorkItemUI): WorkItemService {
    let serviceModel = switchModel<WorkItemUI, WorkItemService>(arg, this.uiToServiceMapTree);

    // Removing relationship part of iteration
    if (serviceModel.relationships.iteration.data !== null) {
      serviceModel.relationships.iteration.data = cleanObject(
        serviceModel.relationships.iteration.data,
        ['relationships'],
      );
    }

    // Removing attributes from assignees
    if (serviceModel.relationships.assignees.data !== null) {
      serviceModel.relationships.assignees.data = serviceModel.relationships.assignees.data.map(
        (a) => {
          return cleanObject(a, ['attributes']);
        },
      );
    }

    // Removing relationship part of baseType
    if (serviceModel.relationships.baseType.data !== null) {
      serviceModel.relationships.baseType.data = cleanObject(
        serviceModel.relationships.baseType.data,
        ['relationships'],
      );
    }

    return cleanObject(serviceModel);
  }

  cleanModel(arg: WorkItemService, keysToRemove: string[] = []) {
    return cleanObject(arg, keysToRemove);
  }
}

export const workItemSelector = createSelector(
  plannerSelector,
  // TODO
  // This is a HACK till fabric8-ui removes the unnecessary planner imports
  // it should just be
  // state => state.workItems
  (state) => (state ? state.workItems : { entities: {}, ids: [] }),
);
// should never be exported
const workItemEntities = createSelector(
  workItemSelector,
  selectEntities,
);
export const getAllWorkItemSelector = createSelector(
  workItemSelector,
  selectAll,
);

export const workItemDetailSelector = createFeatureSelector<DetailPageState>('detailPage');

export const workItemInDetailSelector = createSelector(
  workItemDetailSelector,
  (state) => state.workItem,
);

@Injectable()
export class WorkItemQuery {
  constructor(
    private store: Store<AppState>,
    private userQuery: UserQuery,
    private iterationQuery: IterationQuery,
    private areaQuery: AreaQuery,
    private labelQuery: LabelQuery,
    private workItemTypeQuery: WorkItemTypeQuery,
  ) {}

  private workItemSource = this.store.pipe(select(getAllWorkItemSelector));

  resolveWorkItem(workItem: WorkItemUI): WorkItemUI {
    return {
      ...workItem,
      typeObs: this.workItemTypeQuery.getWorkItemTypeWithChildrenById(workItem.type),
      creatorObs: this.userQuery.getUserObservableById(workItem.creator),
      assigneesObs: this.userQuery.getUserObservablesByIds(workItem.assignees),
      iterationObs: this.iterationQuery.getIterationObservableById(workItem.iterationId),
      areaObs: this.areaQuery.getAreaObservableById(workItem.areaId),
      labelsObs: this.labelQuery.getLabelObservablesByIds(workItem.labels),
    };
  }

  getWorkItems(): Observable<WorkItemUI[]> {
    return this.workItemSource.pipe(
      map((workItems) => {
        return workItems.map(this.resolveWorkItem.bind(this));
      }),
    );
  }

  getWorkItem(number: string | number): Observable<WorkItemUI> {
    return this.store.pipe(
      select(workItemInDetailSelector),
      filter((item) => item !== null),
      map(this.resolveWorkItem.bind(this)),
      switchMap(this.setWorkItemsEditable.bind(this)),
    );
  }

  /**
   * @description set property workItem.editable: true
   * IF loggedInUser is a Collaborator or creator of WorkItem
   * @param WorkItemUI || @param WorkItemUI[]
   * @return Observable<WorkItemUI> || @return Observable<WorkItemUI[]>
   */
  setWorkItemsEditable(
    workItems: WorkItemUI | WorkItemUI[],
  ): Observable<WorkItemUI | WorkItemUI[]> {
    let items = Array.isArray(workItems) ? workItems : [workItems];
    return combineLatest(this.userQuery.getLoggedInUser, this.userQuery.getCollaboratorIds).pipe(
      map(
        ([loggdInuser, collabIDs]): WorkItemUI[] => {
          return items.map((item: WorkItemUI) => {
            const allAllowedIds = loggdInuser ? [...collabIDs, item.creator] : [];
            return {
              ...item,
              editable: allAllowedIds.indexOf(loggdInuser.id) > -1,
            };
          });
        },
      ),
      map((items) => {
        return Array.isArray(workItems) ? items : items[0];
      }),
    );
  }

  /**
   * This function returns an observable for the the selector component
   * with iteration data and the selected iteration flagged
   * This data can be used in work item detail page for the
   * iteration selector dropdown.
   * @param number
   */
  getIterationsForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number).pipe(
      filter((w) => !!w),
      switchMap((workitem) => {
        return this.iterationQuery.getIterations().pipe(
          map((iterations) => {
            return orderBy(iterations, 'name', 'asc').map((i) => {
              return {
                key: i.id,
                value: i.resolvedParentPath != '/' ? '/' + i.name : '/',
                selected: i.id === workitem.iterationId,
                cssLabelClass: undefined,
              };
            });
          }),
        );
      }),
    );
  }

  /**
   * This function returns an observable for the the selector component
   * with area data and the selected area flagged
   * This data can be used in work item detail page for the
   * area selector dropdown.
   * @param number
   */
  getAreasForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number).pipe(
      filter((w) => !!w),
      switchMap((workItem) => {
        return this.areaQuery.getAreas().pipe(
          map((areas) => {
            return areas.map((area) => {
              return {
                key: area.id,
                value:
                  (area.parentPathResolved != '/' ? area.parentPathResolved : '') + '/' + area.name,
                selected: area.id === workItem.areaId,
                cssLabelClass: undefined,
              };
            });
          }),
        );
      }),
    );
  }

  /**
   * This function returns an observable for the the selector component
   * with work item type data and the selected iteration flagged
   * This data can be used in work item detail page for the
   * work item type selector dropdown.
   * @param number
   */

  getTypesForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number).pipe(
      filter((w) => !!w),
      switchMap((workItem) => {
        return this.workItemTypeQuery.getWorkItemTypes().pipe(
          map((types) => {
            return types.map((t) => {
              return {
                key: t.id,
                value: t.name,
                selected: t.id === workItem.type,
                icon: t.icon ? t.icon : '',
              };
            });
          }),
        );
      }),
    );
  }

  /**
   * This function returns an observable for the the selector component
   * with work item state data and the selected iteration flagged
   * This data can be used in work item detail page for the
   * work item states selector dropdown.
   * @param number
   */

  getStatesForWorkItem(number: string | number): Observable<CommonSelectorUI[]> {
    return this.getWorkItem(number).pipe(
      filter((w) => !!w),
      switchMap((workItem) => {
        return this.workItemTypeQuery.getWorkItemTypes().pipe(
          map((types) => types.find((type) => type.id === workItem.type)),
          map((type) => {
            if (!!!type) {
              return [];
            }
            return type.fields['system.state'].type.values.map((s) => {
              return {
                key: s,
                value: s,
                selected: s === workItem.state,
              };
            });
          }),
        );
      }),
    );
  }

  get getWorkItemEntities(): Observable<{ [id: string]: WorkItemUI }> {
    return this.store.pipe(select(workItemEntities));
  }

  getWorkItemsByIds(ids: string[]): Observable<WorkItemUI[]> {
    const selector = createSelector(
      workItemEntities,
      (state) => {
        return ids.length > 0
          ? ids
              .map((i) => state[i])
              // Sometime
              .filter((item) => !!item)
              .map((item) => this.resolveWorkItem(item))
              .sort((a, b) => b.order - a.order)
          : [];
      },
    );
    return this.store.pipe(
      select(selector),
      switchMap(this.setWorkItemsEditable.bind(this)),
    );
  }

  getWorkItemWithId(id: string): Observable<WorkItemUI> {
    const selector = createSelector(
      workItemEntities,
      (state) => this.resolveWorkItem(state[id]),
    );
    return this.store.pipe(select(selector));
  }
}
