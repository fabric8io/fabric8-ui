import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppState, PlannerState } from '../states/app.state';
import { Mapper, MapTree, modelService, modelUI, switchModel } from './common.model';
export class AreaModel extends modelService {
  attributes?: AreaAttributes;
  links?: AreaLinks;
  relationships?: AreaRelations;
}

export class AreaAttributes {
  name: string;
  description?: string;
  parent_path: string;
  parent_path_resolved: string;
}

export class AreaLinks {
  related: string;
  self: string;
}

export class AreaRelations {
  space: {
    data: {
      id: string;
      type: string;
    };
    links: {
      self: string;
    };
  };
  workitems: {
    links: {
      related: string;
    };
  };
}

export interface AreaUI extends modelUI {
  parentPath: string;
  parentPathResolved: string;
}

export interface AreaService extends AreaModel {}

export class AreaMapper implements Mapper<AreaService, AreaUI> {
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
      fromPath: ['attributes', 'parent_path'],
      toPath: ['parentPath'],
    },
    {
      fromPath: ['attributes', 'parent_path_resolved'],
      toPath: ['parentPathResolved'],
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
      toPath: ['attributes', 'parent_path'],
      fromPath: ['parentPath'],
    },
    {
      toPath: ['attributes', 'parent_path_resolved'],
      fromPath: ['parentPathResolved'],
    },
    {
      toPath: ['type'],
      toValue: 'areas',
    },
  ];

  toUIModel(arg: AreaService): AreaUI {
    return switchModel<AreaService, AreaUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: AreaUI): AreaService {
    return switchModel<AreaUI, AreaService>(arg, this.uiToServiceMapTree);
  }
}

@Injectable()
export class AreaQuery {
  private plannerSelector = createFeatureSelector<PlannerState>('planner');
  private areaSelector = createSelector(
    this.plannerSelector,
    (state) => state.areas,
  );
  private areaSource = this.store.pipe(select(this.areaSelector));

  constructor(private store: Store<AppState>) {}

  getAreas(): Observable<AreaUI[]> {
    return this.areaSource.pipe(
      map((areas) => {
        return Object.keys(areas).map((id) => areas[id]);
      }),
    );
  }

  getAreaIds(): Observable<string[]> {
    return this.areaSource.pipe(map((areas) => Object.keys(areas)));
  }

  getAreaNames(): Observable<string[]> {
    return this.getAreas().pipe(map((areas) => areas.map((a) => a.name)));
  }

  getAreaObservableById(id: string): Observable<AreaUI> {
    return this.areaSource.pipe(select((areas) => areas[id]));
  }
}
