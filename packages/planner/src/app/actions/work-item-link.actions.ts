import { Action } from '@ngrx/store';
import { WorkItemLinkService, WorkItemLinkUI } from './../models/link';
import { WorkItemUI } from './../models/work-item';

export const ADD = '[workItemLink] Add';
export const GET = '[workItemLink] Get';
export const DELETE = '[workItemLink] Delete';
export const ADD_SUCCESS = '[workItemLink] AddSuccess';
export const GET_SUCCESS = '[workItemLink] GetSuccess';
export const DELETE_SUCCESS = '[workItemLink] DeleteSuccess';
export const ADD_ERROR = '[workItemLink] AddError';
export const GET_ERROR = '[workItemLink] GetError';
export const DELETE_ERROR = '[workItemLink] DeleteError';
export const RESET_LINKS = '[workItemLink] Reset';
export const TRIVIALIZE_ALL = '[workItemLink] TrivializeAll';

export class Add implements Action {
  payload: WorkItemLinkService;
  constructor(payload: WorkItemLinkService) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class Delete implements Action {
  payload: {
    wiLink: WorkItemLinkUI;
    workItemId: string;
  };
  constructor(payload: { wiLink: WorkItemLinkUI; workItemId: string }) {
    this.payload = payload;
  }
  readonly type = DELETE;
}

export class AddSuccess implements Action {
  payload: WorkItemLinkUI;
  constructor(payload: WorkItemLinkUI) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class GetSuccess implements Action {
  payload: WorkItemLinkUI[];
  constructor(payload: WorkItemLinkUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class DeleteSuccess implements Action {
  payload: WorkItemLinkUI;
  constructor(payload: WorkItemLinkUI) {
    this.payload = payload;
  }
  readonly type = DELETE_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
}

export class ResetLinks implements Action {
  readonly type = RESET_LINKS;
}

export class TrivializeAll implements Action {
  readonly type = TRIVIALIZE_ALL;
}

export type All =
  | Add
  | AddSuccess
  | AddError
  | Get
  | GetSuccess
  | GetError
  | Delete
  | DeleteSuccess
  | DeleteError
  | ResetLinks
  | TrivializeAll;
