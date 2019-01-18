import { Action } from '@ngrx/store';
import {
  WorkItemTypeMapper,
  WorkItemTypeService,
  WorkItemTypeUI,
} from './../models/work-item-type';

export const GET = '[wi-type] Get';
export const GET_SUCCESS = '[wi-type] GetSuccess';
export const GET_ERROR = '[wi-type] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: WorkItemTypeUI[];
  constructor(payload: WorkItemTypeUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
