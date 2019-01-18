import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppState } from '../states/app.state';
import { Mapper, MapTree, switchModel } from './common.model';
import { LinkType, LinkTypeService } from './link-type';
import { workItemDetailSelector, WorkItemMapper, WorkItemUI } from './work-item';

export class Link {
  id?: string;
  type: string;
  attributes: {
    version: Number;
  };
  relationships: {
    // "link_type": LinkType
    link_type: {
      data: {
        id: string;
        type: string;
      };
    };
    source: {
      data: {
        id: string;
        type: string;
      };
    };
    target: {
      data: {
        id: string;
        type: string;
      };
    };
  };
  relationalData?: RelationalData;
}

export class RelationalData {
  source?: {
    title: string;
    id: string;
    number: string;
    state: string;
  };
  target?: {
    title: string;
    id: string;
    number: string;
    state: string;
  };
  linkType?: string;
}

export interface WorkItemLinkService extends Link {}

export interface LinkTypeUI {
  id: string;
  type: string;
  forwardName: string;
  reverseName: string;
  version: string;
  selfLink: string;
}

export class LinkTypeMapper implements Mapper<LinkTypeService, LinkTypeUI> {
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
      fromPath: ['attributes', 'forward_name'],
      toPath: ['forwardName'],
    },
    {
      fromPath: ['attributes', 'reverse_name'],
      toPath: ['reverseName'],
    },
    {
      fromPath: ['attributes', 'topology'],
      toPath: ['topology'],
    },
    {
      fromPath: ['attributes', 'version'],
      toPath: ['version'],
    },
    {
      fromPath: ['type'],
      toPath: ['type'],
    },
    {
      fromPath: ['relationships', 'links', 'self'],
      toPath: ['selfLink'],
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
      toPath: ['attributes', 'forward_name'],
      fromPath: ['forwardName'],
    },
    {
      toPath: ['attributes', 'reverse_name'],
      fromPath: ['reverseName'],
    },
    {
      toPath: ['attributes', 'topology'],
      fromPath: ['topology'],
    },
    {
      toPath: ['attributes', 'version'],
      fromPath: ['version'],
    },
    {
      toPath: ['type'],
      fromPath: ['type'],
    },
    {
      toPath: ['relationships', 'links', 'self'],
      fromPath: ['selfLink'],
    },
  ];

  toUIModel(arg: LinkTypeService): LinkTypeUI {
    return switchModel<LinkTypeService, LinkTypeUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: LinkTypeUI): LinkTypeService {
    return switchModel<LinkTypeUI, LinkTypeService>(arg, this.uiToServiceMapTree);
  }
}

export interface WorkItemLinkUI {
  id: string;
  type: string;
  version: number;
  linkType: LinkTypeUI;
  source: WorkItemUI;
  target: WorkItemUI;
  newlyAdded: boolean;
}

export class WorkItemLinkMapper implements Mapper<WorkItemLinkService, WorkItemLinkUI> {
  ltMapper = new LinkTypeMapper();
  wiMapper = new WorkItemMapper();

  serviceToUiMapTree: MapTree = [
    {
      fromPath: ['id'],
      toPath: ['id'],
    },
    {
      fromPath: ['type'],
      toPath: ['type'],
    },
    {
      fromPath: ['attributes', 'version'],
      toPath: ['version'],
    },
    {
      fromPath: ['relationships', 'link_type', 'data'],
      toPath: ['linkType'],
      toFunction: this.ltMapper.toUIModel.bind(this.ltMapper),
    },
    {
      fromPath: ['relationships', 'source', 'data'],
      toPath: ['source'],
      toFunction: this.wiMapper.toUIModel.bind(this.wiMapper),
    },
    {
      fromPath: ['relationships', 'target', 'data'],
      toPath: ['target'],
      toFunction: this.wiMapper.toUIModel.bind(this.wiMapper),
    },
    {
      toPath: ['newlyAdded'],
      toValue: false,
    },
  ];

  uiToServiceMapTree: MapTree = [
    {
      toPath: ['id'],
      fromPath: ['id'],
    },
    {
      toPath: ['type'],
      fromPath: ['type'],
    },
    {
      toPath: ['attributes', 'version'],
      fromPath: ['version'],
    },
    {
      toPath: ['relationships', 'link_type', 'data'],
      fromPath: ['linkType'],
      toFunction: this.ltMapper.toServiceModel.bind(this.ltMapper),
    },
    {
      toPath: ['relationships', 'source', 'data'],
      fromPath: ['source'],
      toFunction: this.wiMapper.toServiceModel.bind(this.wiMapper),
    },
    {
      toPath: ['relationships', 'target', 'data'],
      fromPath: ['target'],
      toFunction: this.wiMapper.toServiceModel.bind(this.wiMapper),
    },
  ];

  toUIModel(arg: WorkItemLinkService): WorkItemLinkUI {
    return switchModel<WorkItemLinkService, WorkItemLinkUI>(arg, this.serviceToUiMapTree);
  }

  toServiceModel(arg: WorkItemLinkUI): WorkItemLinkService {
    return switchModel<WorkItemLinkUI, WorkItemLinkService>(arg, this.uiToServiceMapTree);
  }
}

@Injectable()
export class WorkItemLinkQuery {
  constructor(private store: Store<AppState>) {}

  get getWorkItemLinks() {
    return this.store.pipe(
      select(workItemDetailSelector),
      select((state) => state.workItemLink),
    );
  }

  get getWorkItemLinksCount() {
    return this.getWorkItemLinks.pipe(map((links) => (Array.isArray(links) ? links.length : -1)));
  }
}
