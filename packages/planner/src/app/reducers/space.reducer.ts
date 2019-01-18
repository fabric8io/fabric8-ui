import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as SpaceActions from './../actions/space.actions';

import { initialState, SpaceState } from '../states/space.state';

export type Action = SpaceActions.All;

export const SpaceReducer: ActionReducer<SpaceState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case SpaceActions.GET_SUCCESS: {
      return action.payload;
    }
    case SpaceActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
};
