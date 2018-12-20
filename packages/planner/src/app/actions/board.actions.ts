import { Action } from '@ngrx/store';
import { BoardState } from '../states/board.state';

export const GET = '[board] Get';
export const GET_SUCCESS = '[board] GetSuccess';
export const GET_ERROR = '[board] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: BoardState;
  constructor(payload: BoardState) {
    this.payload = payload;
  }

  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
