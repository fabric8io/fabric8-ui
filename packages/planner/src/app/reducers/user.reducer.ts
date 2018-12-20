import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as UserActions from './../actions/user.actions';

import { initialState, UserState } from '../states/user.state';

export type Action = UserActions.All;

export const UserReducer: ActionReducer<UserState> = (state = initialState, action: Action) => {
  if (!state) {
    state = {};
  }
  switch (action.type) {
    case UserActions.SET: {
      return { ...state, ...action.payload };
    }
    default: {
      return state;
    }
  }
};
