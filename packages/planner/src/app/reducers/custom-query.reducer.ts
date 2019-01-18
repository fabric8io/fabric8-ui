import { ActionReducer, State } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import { CustomQueryState, initialState } from '../states/custom-query.state';
import * as CustomQueryActions from './../actions/custom-query.actions';

export type Action = CustomQueryActions.All;

export const CustomQueryReducer: ActionReducer<CustomQueryState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case CustomQueryActions.GET_SUCCESS: {
      return action.payload;
    }

    case CustomQueryActions.GET_ERROR: {
      return state;
    }

    case CustomQueryActions.ADD_SUCCESS: {
      return [...state, action.payload];
    }

    case CustomQueryActions.DELETE_SUCCESS: {
      let index = state.findIndex((cq) => cq.id === action.payload.id);
      if (index > -1) {
        state.splice(index, 1);
      }
      return [...state];
    }

    case CustomQueryActions.DELETE_ERROR: {
      return state;
    }

    case CustomQueryActions.SELECT: {
      const newState = state.map((q) => {
        q.selected = q.id === action.payload.id;
        return q;
      });
      return [...newState];
    }

    case CustomQueryActions.SELECT_NONE: {
      const newState = state.map((q) => {
        q.selected = false;
        return q;
      });
      return [...newState];
    }

    default: {
      return state;
    }
  }
};
