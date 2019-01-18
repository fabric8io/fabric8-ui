import { ActionReducer, State } from '@ngrx/store';
import { FilterState, initialState } from '../states/filter.state';
import * as FilterActions from './../actions/filter.actions';

export type Action = FilterActions.All;

export const FilterReducer: ActionReducer<FilterState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case FilterActions.GET_SUCCESS: {
      return action.payload;
    }

    case FilterActions.GET_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
};
