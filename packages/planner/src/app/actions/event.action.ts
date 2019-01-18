import { Action } from '@ngrx/store';
import { EventUI } from './../models/event.model';

export const GET = '[event] Get';
export const GET_SUCCESS = '[event] GetSuccess';
export const GET_ERROR = '[event] GetError';

export class Get implements Action {
  payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: EventUI[];
  constructor(payload: EventUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
