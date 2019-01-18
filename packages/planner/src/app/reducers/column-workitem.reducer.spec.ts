import { GET_SUCCESS, GetSuccess } from '../actions/work-item.actions';
import { WorkItemUI } from '../models/work-item';
import { ColumnWorkItemState, InitialColumnWorkItemState } from '../states/index.state';
import { GetError } from './../actions/board.actions';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';
import { ColumnWorkItemReducer } from './column-workitem.reducer';

describe('ColumnWorkitemReducer: ', () => {
  it('should update column-workitem state on [workitem] Get Success', () => {
    const workitems: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 2',
        number: '2',
        columnIds: ['0000-000-05', '0000-000-06'],
      },
      {
        id: '2',
        title: 'Work Item 1',
        number: '1',
        columnIds: ['0000-000-05', '0000-000-07'],
      },
      {
        id: '3',
        title: 'Work Item 1',
        number: '3',
        columnIds: null,
      },
    ] as WorkItemUI[];

    const columWorkItemState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1'],
      '0000-000-07': ['2'],
    };

    const action = new GetSuccess({ workItems: workitems, nextLink: '' });
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(columWorkItemState);
  });

  it('should not update the state when there are no columnIds', () => {
    const workitems: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 1',
        number: '1',
        columnIds: null,
      },
    ] as WorkItemUI[];

    const action = new GetSuccess({ workItems: workitems, nextLink: '' });
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(InitialColumnWorkItemState);
  });

  it('should return the state when some other action is dispatched', () => {
    const action = new GetError();
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);
    expect(state).toEqual(InitialColumnWorkItemState);
  });

  it('should update the state on [column workitem] Update Success', () => {
    const columnWorkItemState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1'],
      '0000-000-07': ['2', '3'],
    };

    const payload = {
      workItemId: '3',
      prevColumnId: '0000-000-07',
      newColumnIds: ['0000-000-06', '0000-000-08'],
    };

    const updatedState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1', '3'],
      '0000-000-07': ['2'],
      '0000-000-08': ['3'],
    };

    const action = new ColumnWorkItemActions.UpdateSuccess(payload);
    const state = ColumnWorkItemReducer(columnWorkItemState, action);

    expect(state).toEqual(updatedState);
  });

  it('should update to previous state on [column workitem] Update Error', () => {
    const payload = {
      prevColumnId: '0000-000-07',
      newColumnIds: ['0000-000-06', '0000-000-08'],
    };

    const cwState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1', '3'],
      '0000-000-07': ['2'],
      '0000-000-08': ['3'],
    };

    const action = new ColumnWorkItemActions.UpdateError(payload);
    const state = ColumnWorkItemReducer(cwState, action);

    expect(state).toEqual(cwState);
  });
});
