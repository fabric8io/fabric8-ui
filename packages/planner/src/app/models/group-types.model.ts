import { Injectable } from '@angular/core';
// MemoizedSelector is needed even if it's not being used in this file
// Else you get this error
// Exported variable 'groupTypeSelector' has or is using name 'MemoizedSelector'
// from external module "@ngrx/store/src/selector" but cannot be named.
import { createSelector, MemoizedSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppState } from './../states/app.state';
import { Mapper, MapTree, modelService, modelUI, switchModel } from './common.model';
import { plannerSelector } from './space';

export class GroupTypesModel extends modelService {
  attributes: WITGroupAttributes;
  links?: {
    related: string;
  };
  relationships?: WorkItemRelations;
}

export class WITGroupAttributes {
  bucket: string;
  level: number[];
  icon: string;
  sublevel?: number;
  group: string;
  name: string;
  ['show-in-sidebar']: boolean;
  description: string;
}

export class WorkItemRelations {
  defaultType?: {
    data?: object;
    links?: object;
  };
  nextGroup?: {
    data?: object;
    links?: object;
  };
  spaceTemplate?: {
    data?: object;
    links?: object;
  };
  typeList?: {
    data?: TypeListData[];
  };
}

export class TypeListData {
  id: string;
  workitemtype: string;
}

export interface GroupTypeService extends GroupTypesModel {}

// id: id
// name: attributes / name
export interface GroupTypeUI extends modelUI {
  bucket: string; // attributes / bucket
  level: number[]; // attributes / level
  icon: string; // attributes / icon
  sublevel?: number; // attributes / sublevel
  group: string; // attributes / group
  selected: boolean;
  showInSideBar: boolean; // attributes / show-in-sidebar
  typeList: TypeListData[]; // relationships / typeList / data
  description: string; // attributes / description
}

export class GroupTypeMapper implements Mapper<GroupTypeService, GroupTypeUI> {
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
      fromPath: ['attributes', 'bucket'],
      toPath: ['bucket'],
    },
    {
      fromPath: ['attributes', 'level'],
      toPath: ['level'],
    },
    {
      fromPath: ['attributes', 'icon'],
      toPath: ['icon'],
    },
    {
      fromPath: ['attributes', 'sublevel'],
      toPath: ['sublevel'],
    },
    {
      fromPath: ['attributes', 'group'],
      toPath: ['group'],
    },
    {
      toPath: ['selected'],
      toValue: false,
    },
    {
      fromPath: ['attributes', 'show-in-sidebar'],
      toPath: ['showInSideBar'],
    },
    {
      fromPath: ['relationships', 'typeList', 'data'],
      toPath: ['typeList'],
    },
    {
      fromPath: ['attributes', 'description'],
      toPath: ['description'],
      toFunction: (value) => value || 'no info-tip',
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['name'],
      toPath: ['attributes', 'name'],
    },
    {
      fromPath: ['bucket'],
      toPath: ['attributes', 'bucket'],
    },
    {
      fromPath: ['level'],
      toPath: ['attributes', 'level'],
    },
    {
      fromPath: ['icon'],
      toPath: ['attributes', 'icon'],
    },
    {
      fromPath: ['sublevel'],
      toPath: ['attributes', 'sublevel'],
    },
    {
      fromPath: ['group'],
      toPath: ['attributes', 'group'],
    },
    {
      fromPath: ['showInSideBar'],
      toPath: ['attributes', 'show-in-sidebar'],
    },
    {
      fromPath: ['typeList'],
      toPath: ['relationships', 'typeList', 'data'],
    },
    {
      toPath: ['type'],
      toValue: 'grouptypes',
    },
  ];

  toUIModel(arg: GroupTypeService): GroupTypeUI {
    return switchModel<GroupTypeService, GroupTypeUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: GroupTypeUI): GroupTypeService {
    return switchModel<GroupTypeUI, GroupTypeService>(arg, this.uiToServiceMapTree);
  }
}

export const groupTypeSelector = createSelector(
  plannerSelector,
  (state) => state.groupTypes,
);
@Injectable()
export class GroupTypeQuery {
  constructor(private store: Store<AppState>) {}
  get getGroupTypes(): Observable<GroupTypeUI[]> {
    return this.store.pipe(
      select(groupTypeSelector),
      filter((g) => g.length > 0),
    );
  }
  get getFirstGroupType(): Observable<GroupTypeUI> {
    return this.getGroupTypes.pipe(map((g) => g[0]));
  }
}
