import { Action } from '@ngrx/store';
import { UserUI } from './../models/user';

export const GET = '[collaborator] Get';
export const GET_SUCCESS = '[collaborator] GetSuccess';
export const GET_ERROR = '[collaborator] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: string[];

  constructor(payload: string[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
