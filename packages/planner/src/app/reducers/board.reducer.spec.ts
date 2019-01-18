import * as BoardActions from './../actions/board.actions';
import { BoardState, initialState as BoardInitialState } from './../states/board.state';
import { BoardReducer } from './board.reducer';
export type Action = BoardActions.All;

describe('BoardReducer:', () => {
  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = BoardReducer(undefined, action);

    expect(state).toBe(BoardInitialState);
  });

  it('Initial state should be an empty Object', () => {
    const initialState = {};
    expect(BoardInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const boards: BoardState = {
      '000-000-003': {
        id: '000-000-002',
        name: 'Scenarios Board',
        description: 'This is the default board config for the legacy template (Experiences).',
        contextType: 'TypeLevelContext',
        context: '000-000-003',
        columns: [
          {
            id: '000-000-005',
            title: 'workitemboardcolumn',
            columnOrder: 0,
            type: 'boardcolumns',
          },
        ],
      },
    };

    const action = new BoardActions.GetSuccess(boards);
    const state = BoardReducer(BoardInitialState, action);

    expect(state).toEqual(boards);
  });

  it('GetError Action should return previous state', () => {
    const previousState: BoardState = {
      '000-000-003': {
        id: '000-000-002',
        name: 'Scenarios Board',
        description: 'This is the default board config for the legacy template (Experiences).',
        contextType: 'TypeLevelContext',
        context: '000-000-003',
        columns: [
          {
            id: '000-000-005',
            title: 'workitemboardcolumn',
            columnOrder: 0,
            type: 'boardcolumns',
          },
        ],
      },
    };
    const action = new BoardActions.GetError();
    const state = BoardReducer(previousState, action);

    expect(previousState).toEqual(state);
  });
});
