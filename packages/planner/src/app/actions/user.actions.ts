import { Action } from '@ngrx/store';
import { UserUI } from './../models/user';
import { UserState } from './../states/user.state';

export const SET = '[users] Set';
export const GET = '[users] Get';
export const GET_ERROR = '[users] GetError';

/**
 * This action class set the normalized user data
 * Be it one user or number of users we can use
 * this action to update the user state
 * The payload value is a dictionary of users
 * where the id is the key and value is the entire
 */
export class Set implements Action {
  payload: UserState;
  constructor(payload: UserState) {
    this.payload = payload;
  }
  readonly type = SET;
}

/**
 * This action is used to get one user
 * from server by it's ID
 */
export class Get implements Action {
  payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export type All = Set | Get | GetError;
