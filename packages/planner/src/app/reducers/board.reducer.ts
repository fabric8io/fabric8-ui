import { ActionReducer } from '@ngrx/store';
import * as BoardActions from '../actions/board.actions';
import { BoardState, initialState } from '../states/board.state';

export type Action = BoardActions.All;

export const BoardReducer: ActionReducer<BoardState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case BoardActions.GET_SUCCESS: {
      return { ...action.payload };
    }
    case BoardActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
};
