import * as CustomQueryActions from './../actions/custom-query.actions';
import { CustomQueryModel } from './../models/custom-query.model';
import { initialState as CustomQueryInitialState } from './../states/custom-query.state';
import { CustomQueryReducer } from './custom-query.reducer';

export type Action = CustomQueryActions.All;

describe('CustomQueryReducer: ', () => {
  let queries: CustomQueryModel[];
  beforeEach(() => {
    queries = [
      {
        id: 'a34f7349-caee-4b6a-a344-cf3f52d9a12a',
        attributes: {
          fields:
            '{"$AND":[{"space":{"$EQ":"f7fa05ae-5642-4ba8-acf4-355b544fb662"}},{"typegroup.name":{"$EQ":"Scenarios"}},{"assignee":{"$EQ":"5502a92a-15ee-4a7d-a151-fb6395030994"}}]}',
          title: 'My work item',
        },
        selected: false,
        type: 'queries',
      },
    ];
  });

  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = CustomQueryReducer(undefined, action);

    expect(state).toBe(CustomQueryInitialState);
  });

  it('Initial state should be an empty array', () => {
    const intialState = [];
    expect(CustomQueryInitialState).toEqual(intialState);
  });

  it('GetSuccess action should return new state', () => {
    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    expect(state).toEqual(queries);
  });

  it('GetError action should return previous state', () => {
    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    const getErrorAction = new CustomQueryActions.GetError();
    const newState = CustomQueryReducer(state, getErrorAction);

    expect(state).toEqual(newState);
  });

  it('AddSuccess action should return new state', () => {
    const action = new CustomQueryActions.AddSuccess(queries[0]);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    expect(state).toEqual(queries);
  });

  it('Select action should return new state', () => {
    const queries1: CustomQueryModel[] = [
      {
        id: 'a34f7349-caee-4b6a-a344-cf3f52d9a12a',
        attributes: {
          fields:
            '{"$AND":[{"space":{"$EQ":"f7fa05ae-5642-4ba8-acf4-355b544fb662"}},{"typegroup.name":{"$EQ":"Scenarios"}},{"assignee":{"$EQ":"5502a92a-15ee-4a7d-a151-fb6395030994"}}]}',
          title: 'My work item',
        },
        selected: true,
        type: 'queries',
      },
    ];

    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    const selectAction = new CustomQueryActions.Select(queries[0]);
    const newState = CustomQueryReducer(state, selectAction);

    expect(newState).toEqual(queries1);
  });

  it('SelectNone action should return new state', () => {
    const queries1: CustomQueryModel[] = [
      {
        id: 'a34f7349-caee-4b6a-a344-cf3f52d9a12a',
        attributes: {
          fields:
            '{"$AND":[{"space":{"$EQ":"f7fa05ae-5642-4ba8-acf4-355b544fb662"}},{"typegroup.name":{"$EQ":"Scenarios"}},{"assignee":{"$EQ":"5502a92a-15ee-4a7d-a151-fb6395030994"}}]}',
          title: 'My work item',
        },
        selected: false,
        type: 'queries',
      },
    ];
    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    const selectNoneAction = new CustomQueryActions.SelectNone();
    const newState = CustomQueryReducer(state, selectNoneAction);

    expect(newState).toEqual(queries1);
  });

  it('DeleteSuccess action should return new state', () => {
    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    const deleteAction = new CustomQueryActions.DeleteSuccess(queries[0]);
    const newState = CustomQueryReducer(state, deleteAction);

    expect(newState.length).toBe(0);
  });

  it('DeleteError action should return previous state', () => {
    const action = new CustomQueryActions.GetSuccess(queries);
    const state = CustomQueryReducer(CustomQueryInitialState, action);

    const deleteErrorAction = new CustomQueryActions.DeleteError();
    const previousState = CustomQueryReducer(state, deleteErrorAction);

    expect(previousState).toEqual(state);
  });
});
