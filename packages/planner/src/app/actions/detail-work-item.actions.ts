import { Action } from '@ngrx/store';
import { WorkItemUI } from './../models/work-item';

export const GET_WORKITEM = '[workItem] GetWorkItem'; // Get a workitem by number
export const GET_WORKITEM_SUCCESS = '[workItem] GetWorkItemSuccess';
export const GET_WORKITEM_ERROR = '[workItem] GetWorkItemError';

export class GetWorkItem implements Action {
  payload: { number: string | number };
  constructor(payload: { number: string | number }) {
    this.payload = payload;
  }
  readonly type = GET_WORKITEM;
}

export class GetWorkItemSuccess implements Action {
  payload: WorkItemUI;
  constructor(payload: WorkItemUI) {
    this.payload = payload;
  }
  readonly type = GET_WORKITEM_SUCCESS;
}

export class GetWorkItemError implements Action {
  readonly type = GET_WORKITEM_ERROR;
}

export type All = GetWorkItem | GetWorkItemSuccess | GetWorkItemError;
