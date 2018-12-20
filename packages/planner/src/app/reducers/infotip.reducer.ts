import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as InfotipActions from './../actions/infotip.actions';
import { InfotipState, initialState } from './../states/infotip.state';

export type Action = InfotipActions.All;

export const InfotipReducer: ActionReducer<InfotipState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case InfotipActions.GET_SUCCESS: {
      return action.payload;
    }
    case InfotipActions.GET_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
};
