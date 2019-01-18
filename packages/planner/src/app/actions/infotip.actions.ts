import { Action } from '@ngrx/store';
import { InfotipState } from './../states/infotip.state';

export const GET = '[Infotip] Get';
export const GET_SUCCESS = '[Infotip] GetSuccess';
export const GET_ERROR = '[Infotip] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: InfotipState;
  constructor(payload: InfotipState) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
