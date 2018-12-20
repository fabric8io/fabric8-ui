import { ActionReducer } from '@ngrx/store';
import * as WorkItemActions from '../actions/work-item.actions';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';

export type Action = WorkItemActions.All | ColumnWorkItemActions.All;

export const ColumnWorkItemReducer: ActionReducer<ColumnWorkItemState> = (
  state = InitialColumnWorkItemState,
  action: Action,
) => {
  switch (action.type) {
    case WorkItemActions.GET_SUCCESS: {
      let cwState = {};
      action.payload.workItems.forEach((item) => {
        if (item.columnIds !== null) {
          item.columnIds.forEach((col) => {
            if (cwState.hasOwnProperty(col)) {
              cwState[col] = [...cwState[col], item.id];
            } else {
              cwState[col] = [item.id];
            }
          });
        }
      });
      return { ...cwState };
    }
    case ColumnWorkItemActions.UPDATE_SUCCESS: {
      const cwState = { ...state };
      cwState[action.payload.prevColumnId] = cwState[action.payload.prevColumnId].filter(
        (id) => id !== action.payload.workItemId,
      );
      action.payload.newColumnIds.forEach((col) => {
        if (cwState.hasOwnProperty(col)) {
          cwState[col] = [...cwState[col], action.payload.workItemId];
        } else {
          cwState[col] = [action.payload.workItemId];
        }
      });
      return { ...cwState };
    }
    case ColumnWorkItemActions.UPDATE_ERROR: {
      let newState = { ...state };
      newState[action.payload.prevColumnId] = [...state[action.payload.prevColumnId]];
      action.payload.newColumnIds.forEach((colId) => {
        newState[colId] = [...state[colId]];
      });
      return { ...newState };
    }
    default: {
      return state;
    }
  }
};
