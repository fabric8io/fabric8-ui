import { Action } from '@ngrx/store';
import { AreaState } from '../states/area.state';
import { AreaUI } from './../models/area.model';

export const GET = '[area] Get';
export const GET_SUCCESS = '[area] GetSuccess';
export const GET_ERROR = '[area] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: AreaState;
  constructor(payload: AreaState) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
