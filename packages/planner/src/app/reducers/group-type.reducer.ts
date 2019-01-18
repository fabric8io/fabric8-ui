import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as GroupTypeActions from './../actions/group-type.actions';

import { GroupTypeState, initialState } from '../states/grouptype.state';

export type Action = GroupTypeActions.All;

export const GroupTypeReducer: ActionReducer<GroupTypeState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case GroupTypeActions.GET_SUCCESS: {
      return action.payload;
    }

    case GroupTypeActions.GET_ERROR: {
      return state;
    }

    case GroupTypeActions.SELECT: {
      const index = state.findIndex((item) => item.id === action.payload.id);
      if (index > -1) {
        for (let i = 0; i < state.length; i++) {
          state[i].selected = i === index;
        }
      }
      state = [...state]; // This is important for change detection
      return state;
    }

    default: {
      return state;
    }
  }
};
