import { ActionReducer, State } from '@ngrx/store';
import * as CommentActions from './../actions/comment.actions';
import { CommentState, initialState } from './../states/comment.state';

import { Comment } from './../models/comment';

export type Action = CommentActions.All;

export const CommentReducer: ActionReducer<CommentState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case CommentActions.GET_SUCCESS: {
      return [...action.payload];
    }
    case CommentActions.GET_ERROR: {
      return state;
    }
    case CommentActions.ADD_SUCCESS: {
      return [...[action.payload], ...state];
    }
    case CommentActions.ADD_ERROR: {
      return state;
    }
    case CommentActions.UPDATE_SUCCESS: {
      let updatedComment = action.payload;
      let index = state.findIndex((c) => c.id === updatedComment.id);
      if (index > -1) {
        state[index] = action.payload;
      }
      return [...state];
    }
    case CommentActions.UPDATE_ERROR: {
      return state;
    }
    case CommentActions.DELETE_SUCCESS: {
      let deletedComment = action.payload;
      let index = state.findIndex((c) => c.id === deletedComment.id);
      if (index > -1) {
        state.splice(index, 1);
      }
      return [...state];
    }
    case CommentActions.DELETE_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
};
