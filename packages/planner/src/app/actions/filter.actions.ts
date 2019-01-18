import { Action } from '@ngrx/store';
import { FilterModel } from './../models/filter.model';

export const GET = '[filter] Get';
export const GET_SUCCESS = '[filter] GetSuccess';
export const GET_ERROR = '[filter] GetError';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: FilterModel[];
  constructor(payload: FilterModel[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Get | GetSuccess | GetError;
