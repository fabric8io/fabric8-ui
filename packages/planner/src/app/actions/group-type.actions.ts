import { Action } from '@ngrx/store';
import { GroupTypeMapper, GroupTypeService, GroupTypeUI } from './../models/group-types.model';

export const GET = '[group-type] Get';
export const GET_SUCCESS = '[group-type] GetSuccess';
export const GET_ERROR = '[group-type] GetError';
export const SELECT = '[group-type] Select';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: GroupTypeUI[];
  constructor(payload: GroupTypeUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class SelectType implements Action {
  readonly type = SELECT;
  payload: GroupTypeUI;
  constructor(payload: GroupTypeUI) {
    this.payload = payload;
  }
}

export type All = Get | GetSuccess | GetError | SelectType;
