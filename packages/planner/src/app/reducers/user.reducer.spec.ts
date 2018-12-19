import * as UserActions from './../actions/user.actions';
import { UserUI } from './../models/user';
import { initialState as UserInitialState, UserState } from './../states/user.state';
import { UserReducer } from './user.reducer';

export type Action = UserActions.All;

describe('Unit Test :: UserReducer', () => {
  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = UserReducer(undefined, action);
    expect(state).toBe(UserInitialState);
  });

  it('Initial state should be an empty object', () => {
    const initialState = {};
    expect(UserInitialState).toEqual(initialState);
  });

  it('get action should return payload as state', () => {
    const users: UserState = {
      '1': {
        id: '1',
        name: 'user 1',
        avatar: 'user1.jpg',
        username: 'user1',
        currentUser: false,
      },
      '2': {
        id: '2',
        name: 'user 2',
        avatar: 'user2.jpg',
        username: 'user2',
        currentUser: false,
      },
    };
    const action = new UserActions.Set(users);
    const state = UserReducer(undefined, action);
    expect(state).toEqual(users);
  });

  it('add action should add an user to existing state - 1', () => {
    const newUsers: UserState = {
      '1': {
        id: '1',
        name: 'user 1',
        avatar: 'user1.jpg',
        username: 'user1',
        currentUser: false,
      },
    };

    const action = new UserActions.Set(newUsers);
    const state = UserReducer(undefined, action);
    expect(state).toEqual(newUsers);
  });

  it('add action should add an user to existing state - 2', () => {
    const previousState: UserState = {
      '1': {
        id: '1',
        name: 'user 1',
        avatar: 'user1.jpg',
        username: 'user1',
        currentUser: false,
      },
      '2': {
        id: '2',
        name: 'user 2',
        avatar: 'user2.jpg',
        username: 'user2',
        currentUser: false,
      },
    };
    const newUsers: UserState = {
      '3': {
        id: '3',
        name: 'user 3',
        avatar: 'user3.jpg',
        username: 'user3',
        currentUser: false,
      },
    };
    const action = new UserActions.Set(newUsers);
    const state = UserReducer(previousState, action);
    expect({ ...state }).toEqual({ ...{ ...previousState, ...newUsers } });
  });
});
