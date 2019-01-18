import { Action } from '@ngrx/store';
import { IterationState } from '../states/iteration.state';
import { IterationModel, IterationUI } from './../models/iteration.model';

export const ADD = '[Iteration] Add';
export const UPDATE = '[Iteration] Update';
export const GET = '[Iteration] Get';
export const GET_SUCCESS = '[Iteration] GetSuccess';
export const GET_ERROR = '[Iteration] GetError';
export const ADD_SUCCESS = '[Iteration] AddSuccess';
export const ADD_ERROR = '[Iteration] AddError';
export const UPDATE_SUCCESS = '[Iteration] UpdateSuccess';
export const UPDATE_ERROR = '[Iteration] UpdateError';
export const SELECT = '[Iteration] Select';

export class Add implements Action {
  payload: { iteration: IterationUI; parent: IterationUI | null };
  constructor(payload: { iteration: IterationUI; parent: IterationUI | null }) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class AddSuccess implements Action {
  public payload: { iteration: IterationUI; parent: IterationUI | null };
  constructor(payload: { iteration: IterationUI; parent: IterationUI | null }) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class Update implements Action {
  payload: IterationUI;
  constructor(paylod: IterationUI) {
    this.payload = paylod;
  }
  readonly type = UPDATE;
}

export class UpdateSuccess implements Action {
  payload: IterationUI;
  constructor(paylod: IterationUI) {
    this.payload = paylod;
  }
  readonly type = UPDATE_SUCCESS;
}

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  payload: IterationState;
  constructor(payload: IterationState) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}

export class Select implements Action {
  payload: string | null;
  constructor(payload: string | null = null) {
    this.payload = payload;
  }
  readonly type = SELECT;
}

export type All =
  | Add
  | Update
  | Get
  | GetSuccess
  | GetError
  | AddSuccess
  | AddError
  | UpdateSuccess
  | UpdateError
  | Select;
