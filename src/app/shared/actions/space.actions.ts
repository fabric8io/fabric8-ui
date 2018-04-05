import { Action } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';

export const GET          = '[space] Get';
export const GET_SUCCESS  = '[space] GetSuccess';
export const GET_ERROR    = '[space] GetError';
export const ADD          = '[space] Add';
export const ADD_ERROR    = '[space] AddError';
export const ADD_SUCCESS  = '[space] AddSuccess';

export class Get implements Action {
  readonly type = GET;
}

export class GetSuccess implements Action {
  constructor(public payload: Space) {}
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class Add implements Action {
  constructor(public payload: {spaceName: string, ownerId: string}) {}
  readonly type = ADD;
}

export class AddSuccess implements Action {
  constructor(public payload: Space) {}
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  constructor(public payload: {errorCode: string, errorMessage: string}) {}
  readonly type = ADD_ERROR;
}

export type All
  = Get
  | GetSuccess
  | GetError
  | Add
  | AddSuccess
  | AddError;

