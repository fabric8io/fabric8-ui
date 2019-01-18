import { Injectable } from '@angular/core';
import { createEntityAdapter, EntityState } from '@ngrx/entity';

// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'workItemSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';
import { AppState } from '../states/app.state';
import {
  Mapper,
  MapTree,
  modelService,
  modelUI,
  normalizeArray,
  switchModel,
} from './common.model';
import { plannerSelector } from './space';
import { WorkItemService } from './work-item';

export class WorkItemType extends modelService {
  attributes?: {
    name: string;
    version: number;
    description: string;
    icon: string;
    fields: any;
  };
  relationships?: {
    guidedChildTypes?: {
      data?: WorkItemType[];
    };
    space?: Space;
  };
}

export class WorkItemTypeField {
  description?: string;
  label: string;
  required: boolean;
  type: {
    componentType?: string;
    baseType?: string;
    kind: string;
    values?: string[];
  };
}

export interface WorkItemTypeService extends WorkItemType {}

export interface WorkItemTypeUI extends modelUI {
  icon: string;
  version: number;
  type: string;
  description: string;
  childTypes: any;
  infotip: string;
  // TODO: [Symbol.toStringTag]' is missing in type fix
  // `any` should go away
  fields: Map<string, WorkItemTypeField> | any;
  dynamicfields?: any;
}

export class WorkItemTypeMapper implements Mapper<WorkItemTypeService, WorkItemTypeUI> {
  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['attributes', 'name'],
      toPath: ['name'],
    },
    {
      fromPath: ['attributes', 'icon'],
      toPath: ['icon'],
    },
    {
      fromPath: ['attributes', 'version'],
      toPath: ['version'],
    },
    {
      fromPath: ['relationships', 'guidedChildTypes', 'data'],
      toPath: ['childTypes'],
      toFunction: (item: WorkItemTypeService) => {
        return !!item ? item : [];
      },
    },
    {
      fromPath: ['attributes', 'fields'],
      toPath: ['fields'],
    },
    {
      fromPath: ['attributes', 'fields'],
      toPath: ['dynamicfields'],
      toFunction: filterDynamicFields,
    },
    {
      toPath: ['type'],
      toValue: 'workitemtypes',
    },
    {
      fromPath: ['attributes', 'description'],
      toPath: ['description'],
      toFunction: (value) => value || 'no info-tip',
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      toPath: ['id'],
      fromPath: ['id'],
    },
    {
      toPath: ['attributes', 'name'],
      fromPath: ['name'],
    },
    {
      toPath: ['attributes', 'icon'],
      fromPath: ['icon'],
    },
    {
      toPath: ['attributes', 'version'],
      fromPath: ['version'],
    },
    {
      toPath: ['type'],
      toValue: 'workitemtypes',
    },
    {
      fromPath: ['childTypes'],
      toPath: ['relationships', 'guidedChildTypes', 'data'],
      toFunction: (item: WorkItemTypeUI) => {
        return !!item ? item : [];
      },
    },
    {
      toPath: ['attributes', 'fields'],
      fromPath: ['fields'],
    },
  ];

  toUIModel(arg: WorkItemTypeService): WorkItemTypeUI {
    return switchModel<WorkItemTypeService, WorkItemTypeUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: WorkItemTypeUI): WorkItemTypeService {
    return switchModel<WorkItemTypeUI, WorkItemTypeService>(arg, this.uiToServiceMapTree);
  }
}

export class WorkItemTypeResolver {
  private allTypes: WorkItemTypeUI[];
  private normalizedTypes: { [id: string]: WorkItemTypeUI };

  constructor(allTypes: WorkItemTypeUI[] = []) {
    this.allTypes = allTypes;
    this.normalizedTypes = normalizeArray(allTypes);
  }

  resolveChildren() {
    this.allTypes.forEach((type) => {
      type.childTypes = type.childTypes.map((ct) => this.normalizedTypes[ct.id]);
    });
  }

  getResolvedWorkItemTypes() {
    return this.allTypes;
  }
}

function filterDynamicFields(fields: any[]) {
  if (fields !== null) {
    const fieldKeys = Object.keys(fields);
    // These fields won't show up in the details page
    const staticFields = [
      'system.area',
      'system.assignees',
      'system.codebase',
      'system.created_at',
      'system.creator',
      'system.description',
      'system.iteration',
      'system.labels',
      'system.number',
      'system.order',
      'system.remote_item_id',
      'system.state',
      'system.title',
      'system.updated_at',
      'system.metastate',
    ];
    // These fields types won't show up in the details page
    const restrictedFieldTypes = ['float', 'string', 'integer', 'enum', 'markup'];
    return fieldKeys.filter((f) => {
      return (
        staticFields.findIndex((sf) => sf === f) === -1 &&
        restrictedFieldTypes.indexOf(fields[f].type.kind) > -1
      );
    });
  } else {
    return [];
  }
}

// This interface is used to determine state for entity adapter
export interface WorkItemTypeStateModel extends EntityState<WorkItemTypeUI> {}

const workItemTypeAdapter = createEntityAdapter<WorkItemTypeUI>();

// Do not export it
const { selectIds, selectEntities, selectAll, selectTotal } = workItemTypeAdapter.getSelectors();

export const workItemTypeSelector = createSelector(
  plannerSelector,
  (state) => (state ? state.workItemTypes : { ids: [], entities: {} }),
);

// Do not export it
const getWorkItemTypeEntitiesSelector = createSelector(
  workItemTypeSelector,
  selectEntities,
);

@Injectable()
export class WorkItemTypeQuery {
  constructor(private store: Store<AppState>) {}

  getAllWorkItemTypesSelector = createSelector(
    workItemTypeSelector,
    selectAll,
  );

  getWorkItemTypesWithChildrenSelector = createSelector(
    this.getAllWorkItemTypesSelector,
    getWorkItemTypeEntitiesSelector,
    (types, typeEntities) => {
      return types.map((type) => {
        const childTypes = type.childTypes.map((t) => typeEntities[t.id]);
        type.childTypes = childTypes;
        return type;
      });
    },
  );
  workItemTypeSource = this.store.pipe(select(this.getAllWorkItemTypesSelector));

  /**
   * return observable of all workItemTypes
   * without their child types
   */
  getWorkItemTypes(): Observable<WorkItemTypeUI[]> {
    return this.workItemTypeSource.pipe(filter((w) => !!w.length));
  }

  getWorkItemTypesWithChildren(): Observable<WorkItemTypeUI[]> {
    return this.store.pipe(
      select(this.getWorkItemTypesWithChildrenSelector),
      filter((t) => !!t.length),
    );
  }

  getWorkItemTypeWithChildrenById(id: string): Observable<WorkItemTypeUI> {
    return this.store.pipe(
      select(this.getWorkItemTypesWithChildrenSelector),
      map((types) => {
        return types.filter((type) => type.id === id)[0];
      }),
    );
  }

  getWorkItemTypeById(id: string): Observable<WorkItemTypeUI> {
    return this.store.pipe(
      select(getWorkItemTypeEntitiesSelector),
      map((wt) => wt[id]),
    );
  }
}
