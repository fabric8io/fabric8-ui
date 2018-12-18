import { Action } from '@ngrx/store';
import { LinkTypeUI } from './../models/link-type';

export const GET = '[linkType] Get';
export const GET_SUCCESS = '[LinkType] GetSuccess';
export const GET_ERROR = '[LinkType] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: LinkTypeUI[];
  constructor(payload: LinkTypeUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
