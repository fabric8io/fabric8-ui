import { ActionReducer, State } from '@ngrx/store';
import { UPDATE_ERROR } from './../actions/comment.actions';
import * as DetailWorkItemActions from './../actions/detail-work-item.actions';
import * as WorkItemActions from './../actions/work-item.actions';
import { DetailWorkItemState, initialState } from './../states/detail-work-item.state';

import { WorkItem } from './../models/work-item';

export type Action = DetailWorkItemActions.All | WorkItemActions.All;

export const DetailWorkItemReducer: ActionReducer<DetailWorkItemState> = (
  state = initialState,
  action: Action,
) => {
  switch (action.type) {
    case DetailWorkItemActions.GET_WORKITEM_SUCCESS: {
      return { ...action.payload };
    }

    case WorkItemActions.UPDATE_SUCCESS: {
      return { ...action.payload };
    }

    case WorkItemActions.UPDATE_ERROR: {
      return { ...state };
    }

    case DetailWorkItemActions.GET_WORKITEM_ERROR: {
      return state;
    }

    default: {
      return state;
    }
  }
};
