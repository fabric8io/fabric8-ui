import * as GroupTypeActions from './../actions/group-type.actions';
import { GroupTypeUI } from './../models/group-types.model';
import { initialState as GroupTypeIntialState } from './../states/grouptype.state';
import { GroupTypeReducer } from './group-type.reducer';

export type Action = GroupTypeActions.All;

describe('GroupTypeReducer: ', () => {
  let groupTypes: GroupTypeUI[];
  beforeEach(() => {
    groupTypes = [
      {
        id: '679a563c-ac9b-4478-9f3e-4187f708dd30',
        name: 'Scenarios',
        bucket: 'portfolio',
        level: [],
        icon: 'fa fa-bullseye',
        group: null,
        selected: false,
        showInSideBar: true,
        typeList: null,
        description: 'Lorem ipsum dolor sit amet',
      },
      {
        id: '44795662-db7a-44f7-a4e7-c6d41d3eff27',
        name: 'Requirements',
        bucket: 'requirement',
        level: [],
        icon: 'fa fa-list-ul',
        group: null,
        selected: false,
        showInSideBar: true,
        typeList: null,
        description: 'Lorem ipsum dolor sit amet',
      },
    ];
  });

  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = GroupTypeReducer(undefined, action);

    expect(state).toBe(GroupTypeIntialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = [];
    expect(GroupTypeIntialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const action = new GroupTypeActions.GetSuccess(groupTypes);
    const state = GroupTypeReducer(GroupTypeIntialState, action);

    expect(state).toEqual(groupTypes);
  });

  it('GetError action should return previous state', () => {
    const action = new GroupTypeActions.GetSuccess(groupTypes);
    const state = GroupTypeReducer(GroupTypeIntialState, action);

    const getErrorAction = new GroupTypeActions.GetError();
    const newState = GroupTypeReducer(state, getErrorAction);

    expect(newState).toEqual(state);
  });

  it('Select action should return new state with selected attribute true', () => {
    const action = new GroupTypeActions.GetSuccess(groupTypes);
    const state = GroupTypeReducer(GroupTypeIntialState, action);

    expect(state[0].selected).toBe(false);
    expect(state[1].selected).toBe(false);

    const selectAction = new GroupTypeActions.SelectType(groupTypes[0]);
    const newState = GroupTypeReducer(state, selectAction);

    expect(newState[0].selected).toBe(true);
    expect(newState[1].selected).toBe(false);
  });
});
