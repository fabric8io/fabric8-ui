import { ActionReducer, State } from '@ngrx/store';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import { initialState, WorkItemLinkState } from './../states/work-item-link.state';

export type Action = WorkItemLinkActions.All;

export const WorkItemLinkReducer: ActionReducer<WorkItemLinkState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case WorkItemLinkActions.GET_SUCCESS: {
      return action.payload;
    }

    case WorkItemLinkActions.GET_ERROR: {
      return state;
    }

    case WorkItemLinkActions.ADD_SUCCESS: {
      return [action.payload, ...state];
    }

    case WorkItemLinkActions.ADD_ERROR: {
      return [...state];
    }

    case WorkItemLinkActions.DELETE_SUCCESS: {
      let linkIndex = state.findIndex((l) => l.id === action.payload.id);
      if (linkIndex > -1) {
        state.splice(linkIndex, 1);
      }
      return [...state];
    }

    case WorkItemLinkActions.DELETE_ERROR: {
      return [...state];
    }

    case WorkItemLinkActions.RESET_LINKS: {
      return null;
    }

    case WorkItemLinkActions.TRIVIALIZE_ALL: {
      if (state) {
        return state.map((s) => (s.newlyAdded ? { ...s, ...{ newlyAdded: false } } : s));
      } else {
        return null;
      }
    }

    default: {
      return state;
    }
  }
};
