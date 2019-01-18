import { Action } from '@ngrx/store';
import { LabelModel, LabelUI } from './../models/label.model';

export const ADD = '[label] Add';
export const GET = '[label] Get';
export const GET_SUCCESS = '[label] GetSuccess';
export const GET_ERROR = '[label] GetError';
export const ADD_SUCCESS = '[label] AddSuccess';
export const ADD_ERROR = '[label] AddError';

export class Add implements Action {
  payload: any;
  constructor(payload: any) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: LabelUI[];
  constructor(payload: LabelUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class AddSuccess implements Action {
  payload: LabelUI;
  constructor(payload: LabelUI) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export type All = Add | Get | GetSuccess | GetError | AddSuccess | AddError;
