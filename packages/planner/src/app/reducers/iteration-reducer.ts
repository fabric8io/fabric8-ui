import { ActionReducer } from '@ngrx/store';
import { cloneDeep } from 'lodash';
import * as IterationActions from '.././actions/iteration.actions';
import {
  initialState,
  initialUIState,
  IterationState,
  IterationUIState,
} from './../states/iteration.state';

export type Action = IterationActions.All;

export const iterationReducer: ActionReducer<IterationState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case IterationActions.GET_SUCCESS:
      return action.payload;

    case IterationActions.ADD_SUCCESS:
      const parent = action.payload.parent;
      const newIterationId = action.payload.iteration.id;
      if (parent) {
        state[parent.id].hasChildren = true;
      }
      state[newIterationId] = action.payload.iteration;
      return { ...state };

    case IterationActions.UPDATE_SUCCESS:
      const updatedIterationid = action.payload.id;
      if (state[updatedIterationid]) {
        action.payload.selected = state[updatedIterationid].selected;
      }
      state[updatedIterationid] = action.payload;
      return { ...state };

    case IterationActions.SELECT:
      if (state[action.payload]) {
        for (let id in state) {
          state[id].selected = id === action.payload;
          state[id].showChildren = false;
        }
        let pId = state[action.payload].parentId;
        // Backend sends the pId for root iteration '00000000-0000-0000-0000-000000000000'
        // removing pId !== '00000000-0000-0000-0000-000000000000' causes the while loop to go in
        // infinite loop
        while (pId && pId !== '00000000-0000-0000-0000-000000000000') {
          const pIndex = pId;
          if (state[pId]) {
            state[pId].showChildren = true;
            pId = state[pIndex].parentId;
          }
        }
      } else {
        for (let i in state) {
          state[i].selected = false;
          state[i].showChildren = false;
        }
      }
      return { ...state }; // This is important for change detection

    case IterationActions.GET_ERROR:
      return state;

    case IterationActions.ADD_ERROR:
      return state;

    case IterationActions.UPDATE_ERROR:
      return state;

    default:
      return state;
  }
};

export const iterationUiReducer: ActionReducer<IterationUIState> = (
  s = initialUIState,
  action: Action,
) => {
  const state = cloneDeep(s);
  switch (action.type) {
    case IterationActions.UPDATE_SUCCESS:
    case IterationActions.ADD_SUCCESS:
      state.error = '';
      state.modalLoading = false;
      return state;

    case IterationActions.UPDATE:
    case IterationActions.ADD:
      state.error = '';
      state.modalLoading = true;
      return state;

    case IterationActions.ADD_ERROR:
      state.modalLoading = false;
      state.error = 'Some error has occured on adding iteration';
      return state;

    case IterationActions.UPDATE_ERROR:
      state.modalLoading = false;
      state.error = 'Some error has occured on updating iteration';
      return state;

    default:
      return state;
  }
};
