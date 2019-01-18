import { createEntityAdapter } from '@ngrx/entity';
import { State } from '@ngrx/store';
import { ActionReducer } from '@ngrx/store';
import * as LabelActions from './../actions/label.actions';
import { LabelUI } from './../models/label.model';
import { initialState, LabelState } from './../states/label.state';

export type Action = LabelActions.All;
const labelAdapter = createEntityAdapter<LabelUI>();

export const LabelReducer: ActionReducer<LabelState> = (state = initialState, action: Action) => {
  switch (action.type) {
    case LabelActions.GET_SUCCESS: {
      return labelAdapter.addAll(action.payload, state);
    }
    case LabelActions.GET_ERROR: {
      return state;
    }
    case LabelActions.ADD_SUCCESS: {
      return labelAdapter.addOne(action.payload, state);
    }
    case LabelActions.ADD_ERROR: {
      return state;
    }
    default: {
      return state;
    }
  }
};
