import { Action } from '@ngrx/store';
import { IterationUI } from '../models/iteration.model';
import { WorkItemService, WorkItemUI } from './../models/work-item';

export const ADD = '[workItem] Add';
export const GET = '[workItem] Get';
export const UPDATE = '[workItem] Update';
export const ADD_SUCCESS = '[workItem] AddSuccess';
export const ADD_ERROR = '[workItem] AddError';
export const GET_SUCCESS = '[workItem] GetSuccess';
export const GET_ERROR = '[workItem] GetError';
export const UPDATE_SUCCESS = '[workItem] UpdateSuccess';
export const UPDATE_ERROR = '[workItem] UpdateError';
export const GET_CHILDREN = '[workItem] GetChildren';
export const GET_CHILDREN_SUCCESS = '[workItem] GetChildrenSuccess';
export const GET_CHILDREN_ERROR = '[workItem] GetChildrenError';
export const REORDER = '[workItem] Reorder';
export const REORDER_ERROR = '[workItem] ReorderError';
export const UPDATE_WORKITEM_ITERATION = '[workItem] UpdateWorkitemIteration';
export const CREATE_LINK = '[workItemLink] CreateLink';
export const DELETE_LINK = '[workItemLink] DeleteLink';
export const RESET_WORKITEMS = '[workItem] Reset WorkItems';
export const GET_MORE_WORKITEMS = '[workItems] Get More WorkItems';
export const GET_MORE_WORKITEMS_SUCCESS = '[workItems] Get More WorkItems Success';
export const NEXT_LINK_SUCCESS = '[workItem] Next Link Success';
export const DELETE = '[workItem] Delete';
export const DELETE_SUCCESS = '[workItem] DeleteSuccess';
export const DELETE_ERROR = '[workItem] DeleteError';

export class Add implements Action {
  payload: {
    workItem: WorkItemService;
    createId: number;
    parentId: string;
    openDetailPage: boolean;
  };
  constructor(payload: {
    workItem: WorkItemService;
    createId: number;
    parentId: string;
    openDetailPage: boolean;
  }) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  payload: {
    pageSize: number;
    filters: any[];
    isShowTree: boolean;
  };
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class Update implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = UPDATE;
}

export class AddSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class GetSuccess implements Action {
  payload: { workItems: WorkItemUI[]; nextLink: string };
  constructor(payload: { workItems: WorkItemUI[]; nextLink: string }) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class GetChildren implements Action {
  payload: WorkItemUI;
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN;
}

export class GetChildrenSuccess implements Action {
  payload: { parent: WorkItemUI; children: WorkItemUI[] };
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN_SUCCESS;
}

export class GetChildrenError implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = GET_CHILDREN_ERROR;
}

export class UpdateSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = UPDATE_SUCCESS;
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}

export class Reorder implements Action {
  readonly type = REORDER;
  payload: {
    workitem: WorkItemUI;
    destinationWorkitemID: string;
    direction: string;
  };
  constructor(payload: { workitem: WorkItemUI; destinationWorkitemID: string; direction: string }) {
    this.payload = payload;
  }
}

export class UpdateWorkitemIteration implements Action {
  readonly type = UPDATE_WORKITEM_ITERATION;
  payload: {
    iteration: IterationUI;
  };
  constructor(payload: { iteration: IterationUI }) {
    this.payload = payload;
  }
}

export class CreateLink implements Action {
  payload: {
    source: WorkItemUI;
    target: WorkItemUI;
    sourceTreeStatus: string;
  };
  constructor(payload: { source: WorkItemUI; target: WorkItemUI; sourceTreeStatus: string }) {
    this.payload = payload;
  }
  readonly type = CREATE_LINK;
}

export class DeleteLink implements Action {
  payload: {
    source: WorkItemUI;
    target: WorkItemUI;
    sourceTreeStatus: string;
  };
  constructor(payload: { source: WorkItemUI; target: WorkItemUI; sourceTreeStatus: string }) {
    this.payload = payload;
  }
  readonly type = DELETE_LINK;
}

export class ResetWorkItems implements Action {
  readonly type = RESET_WORKITEMS;
}

export class GetMoreWorkItems implements Action {
  payload: {
    isShowTree: boolean;
  };
  constructor(payload: { isShowTree: boolean }) {
    this.payload = payload;
  }
  readonly type = GET_MORE_WORKITEMS;
}

export class GetMoreWorkItemsSuccess implements Action {
  payload: { workItems: WorkItemUI[]; nextLink: string };
  constructor(payload: { workItems: WorkItemUI[]; nextLink: string }) {
    this.payload = payload;
  }
  readonly type = GET_MORE_WORKITEMS_SUCCESS;
}

export class Delete implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = DELETE;
}

export class DeleteSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = DELETE_SUCCESS;
}

export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
}

export type All =
  | Add
  | Get
  | Update
  | AddSuccess
  | AddError
  | GetSuccess
  | GetError
  | UpdateSuccess
  | UpdateError
  | GetChildren
  | GetChildrenSuccess
  | GetChildrenError
  | Reorder
  | UpdateWorkitemIteration
  | CreateLink
  | DeleteLink
  | ResetWorkItems
  | GetMoreWorkItems
  | GetMoreWorkItemsSuccess
  | Delete
  | DeleteSuccess
  | DeleteError;
