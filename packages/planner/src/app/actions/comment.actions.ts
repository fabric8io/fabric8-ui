import { Action } from '@ngrx/store';
import { Comment, CommentUI } from './../models/comment';

export const ADD = '[comment] Add';
export const GET = '[comment] Get';
export const UPDATE = '[comment] Update';
export const DELETE = '[comment] Delete';
export const ADD_SUCCESS = '[comment] AddSuccess';
export const ADD_ERROR = '[comment] AddError';
export const GET_SUCCESS = '[comment] GetSuccess';
export const GET_ERROR = '[comment] GetError';
export const UPDATE_SUCCESS = '[comment] UpdateSuccess';
export const UPDATE_ERROR = '[comment] UpdateError';
export const DELETE_SUCCESS = '[comment] DeleteSuccess';
export const DELETE_ERROR = '[comment] DeleteError';

export class Add implements Action {
  payload: {
    url: string;
    comment: Comment;
  };
  constructor(payload: { url: string; comment: Comment }) {
    this.payload = payload;
  }
  readonly type = ADD;
}

export class Get implements Action {
  payload: string;
  constructor(payload: string) {
    this.payload = payload;
  }
  readonly type = GET;
}

export class Update implements Action {
  payload: Comment;
  constructor(payload: Comment) {
    this.payload = payload;
  }
  readonly type = UPDATE;
}

export class Delete implements Action {
  payload: CommentUI;
  constructor(payload: CommentUI) {
    this.payload = payload;
  }
  readonly type = DELETE;
}

export class AddSuccess implements Action {
  payload: CommentUI;
  constructor(payload: CommentUI) {
    this.payload = payload;
  }
  readonly type = ADD_SUCCESS;
}

export class AddError implements Action {
  readonly type = ADD_ERROR;
}

export class GetSuccess implements Action {
  payload: CommentUI[];
  constructor(payload: CommentUI[]) {
    this.payload = payload;
  }
  readonly type = GET_SUCCESS;
}

export class GetError implements Action {
  readonly type = GET_ERROR;
}

export class UpdateSuccess implements Action {
  payload: CommentUI;
  constructor(payload: CommentUI) {
    this.payload = payload;
  }
  readonly type = UPDATE_SUCCESS;
}

export class UpdateError implements Action {
  readonly type = UPDATE_ERROR;
}

export class DeleteSuccess implements Action {
  payload: CommentUI;
  constructor(payload: CommentUI) {
    this.payload = payload;
  }
  readonly type = DELETE_SUCCESS;
}

export class DeleteError implements Action {
  readonly type = DELETE_ERROR;
}

export type All =
  | Add
  | Get
  | Update
  | Delete
  | AddSuccess
  | AddError
  | GetSuccess
  | GetError
  | UpdateSuccess
  | UpdateError
  | DeleteSuccess
  | DeleteError;
