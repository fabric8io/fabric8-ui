import { Action } from '@ngrx/store';
import { WorkItemService, WorkItemUI } from './../models/work-item';

export const UPDATE = '[column workitem] Update';
export const UPDATE_SUCCESS = '[column workitem] UpdateSuccess';
export const UPDATE_ERROR = '[column workitem] UpdateError';

export class Update implements Action {
  payload: {
    workItem: WorkItemUI;
    reorder: {
      workitem: WorkItemUI;
      destinationWorkitemID: string;
      direction: string;
    };
    prevColumnId: string;
  };

  constructor(payload: {
    workItem: WorkItemUI;
    reorder: {
      workitem: WorkItemUI;
      destinationWorkitemID: string;
      direction: string;
    };
    prevColumnId: string;
  }) {
    this.payload = payload;
  }
  readonly type = UPDATE;
}

export class UpdateSuccess implements Action {
  payload: {
    workItemId: string;
    prevColumnId: string;
    newColumnIds: string[];
  };

  constructor(payload: { workItemId: string; prevColumnId: string; newColumnIds: string[] }) {
    this.payload = payload;
  }
  readonly type = UPDATE_SUCCESS;
}

export class UpdateError implements Action {
  payload: {
    prevColumnId: string;
    newColumnIds: string[];
  };

  constructor(payload: { prevColumnId: string; newColumnIds: string[] }) {
    this.payload = payload;
  }
  readonly type = UPDATE_ERROR;
}

export type All = Update | UpdateSuccess | UpdateError;
