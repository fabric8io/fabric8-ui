import { Action, ActionReducer } from '@ngrx/store';
import * as SpaceActions from '../actions/space.actions';
import { initialState, SpaceState } from '../states/space.state';

export const SpaceReducer: ActionReducer<SpaceState> =
  (state = initialState, action: Action) => {
    switch (action.type) {
      case SpaceActions.GET_SUCCESS: {
        return (action as any).payload;
      }
      case SpaceActions.GET_ERROR: {
        return state;
      }
      case SpaceActions.ADD_SUCCESS: {
        return (action as any).payload;
      }
      case SpaceActions.ADD_ERROR: {
        return (action as any).payload;
      }
      default: {
        return state;
      }
   }
};

