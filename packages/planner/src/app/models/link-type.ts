import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppState } from './../states/app.state';
import { cleanObject, Mapper, MapTree, modelService, modelUI, switchModel } from './common.model';
import { LinkCategory } from './link-category';
import { workItemDetailSelector } from './work-item';

export class LinkType {
  id: string;
  type: string;
  attributes: {
    description: string;
    forward_name: string;
    name: string;
    reverse_name: string;
    topology: string;
    version: number;
  };
  relationships: {
    // 'link_category': LinkCategory,
    link_category: {
      data: {
        id: string;
        type: string;
      };
    };
  };
}

export interface LinkTypeService extends LinkType {}

export interface LinkTypeUI {
  id: string;
  name: string;
  linkType: string;
  description: string;
}

@Injectable()
export class WorkItemLinkTypeQuery {
  constructor(private store: Store<AppState>) {}

  get getLinkTypes(): Observable<LinkTypeUI[]> {
    return this.store.pipe(
      select(workItemDetailSelector),
      select((state) => state.linkType),
      filter((lt) => !!lt.length),
    );
  }

  get getLinkTypesForDropdown() {
    return this.getLinkTypes.pipe(
      map((types) => {
        // The common-dropdown component needs the data in a specific format
        // Each item should have `key` and `value` property
        return types
          .map((t) => {
            return { ...t, value: t.name, key: t.name };
          })
          .sort((t1, t2) => t1.value.localeCompare(t2.value));
      }),
    );
  }
}
