import * as CollaboratorActions from './../actions/collaborator.actions';
import { UserUI } from './../models/user';
import { initialState as CollaboratorInitialState } from './../states/collaborator.state';
import { CollaboratorReducer } from './collaborator.reducer';

export type Action = CollaboratorActions.All;

describe('CollaboratorReducer:', () => {
  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = CollaboratorReducer(undefined, action);

    expect(state).toBe(CollaboratorInitialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = [];
    expect(CollaboratorInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const collaborators: string[] = ['1', '2'];
    const action = new CollaboratorActions.GetSuccess(collaborators);
    const state = CollaboratorReducer(CollaboratorInitialState, action);

    expect(state).toEqual(collaborators);
  });

  it('GetError action should return previous state', () => {
    const previousState: string[] = ['1', '2'];
    const action = new CollaboratorActions.GetError();
    const state = CollaboratorReducer(previousState, action);

    expect(previousState).toEqual(state);
  });
});
