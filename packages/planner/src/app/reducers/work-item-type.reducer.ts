import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';

import { createEntityAdapter } from '@ngrx/entity';
import { WorkItemTypeUI } from '../models/work-item-type';
import { initialState, WorkItemTypeState } from '../states/work-item-type.state';

export type Action = WorkItemTypeActions.All;

const workItemTypeAdapter = createEntityAdapter<WorkItemTypeUI>();

export const WorkItemTypeReducer: ActionReducer<WorkItemTypeState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case WorkItemTypeActions.GET_SUCCESS: {
      return workItemTypeAdapter.addAll(action.payload, state);
    }

    case WorkItemTypeActions.GET_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
};
