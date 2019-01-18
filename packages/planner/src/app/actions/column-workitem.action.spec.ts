import { WorkItemUI } from '../models/work-item';
import * as ColumnWorkItemActions from './column-workitem.action';

describe('Unit Test :: ColumnWorkItem Actions', () => {
  it('UpdateColumnWorkItem :: should create update action', () => {
    const payload = {
      workItem: {} as WorkItemUI,
      reorder: {
        workitem: {} as WorkItemUI,
        destinationWorkitemID: '',
        direction: 'above',
      },
      prevColumnId: '',
    };
    const action = new ColumnWorkItemActions.Update(payload);
    expect({ ...action }).toEqual({
      type: ColumnWorkItemActions.UPDATE,
      payload: payload,
    });
  });

  it('UpdateColumnWorkitemSuccess :: should create UpdateSuccess action', () => {
    const payload = {
      workItemId: '',
      prevColumnId: '',
      newColumnIds: ['', ''],
    };
    const action = new ColumnWorkItemActions.UpdateSuccess(payload);
    expect({ ...action }).toEqual({
      type: ColumnWorkItemActions.UPDATE_SUCCESS,
      payload: payload,
    });
  });

  it('UpdateColumnWorkitemError :: should create UpdateError action', () => {
    const payload = {
      prevColumnId: '',
      newColumnIds: ['', ''],
    };
    const action = new ColumnWorkItemActions.UpdateError(payload);
    expect({ ...action }).toEqual({
      type: ColumnWorkItemActions.UPDATE_ERROR,
      payload: payload,
    });
  });
});
