import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as WIStateActions from './../actions/work-item-state.actions';
import { initialState, WIState } from './../states/work-item-state.state';

export type Action = WIStateActions.All;

export const WorkItemStateReducer: ActionReducer<WIState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case WIStateActions.GET_SUCCESS: {
      return action.payload
        .filter((i) => i.attributes['can-construct'])
        .map((i) => i.attributes.fields['system.state'].type.values)
        .reduce((a, v) => [...a, ...v], [])
        .reduce((a, v) => {
          if (a.indexOf(v) === -1) {
            return [...a, v];
          }
          return a;
        }, []);
    }

    case WIStateActions.GET_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
};
