import { Action } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';

export const GET = '[space] Get';
export const GET_SUCCESS = '[space] GetSuccess';
export const GET_ERROR = '[space] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: Space;
  constructor(payload: Space) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
