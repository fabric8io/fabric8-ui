import * as LabelActions from './../actions/label.actions';
import { LabelUI } from './../models/label.model';
import { initialState as LabelInitialState } from './../states/label.state';
import { LabelReducer } from './label.reducer';

export type Action = LabelActions.All;

describe('LabelReducer: ', () => {
  let labelState;
  let labels: LabelUI[];

  beforeEach(() => {
    labelState = {
      ids: ['22fdcbda-6556-4940-8637-8af834499271', '2698b84a-c121-47b2-8ff5-28a76c808958'],
      entities: {
        '22fdcbda-6556-4940-8637-8af834499271': {
          id: '22fdcbda-6556-4940-8637-8af834499271',
          name: 'Area/Planner',
          version: 0,
          backgroundColor: '#d1d1d1',
          borderColor: '#bbbbbb',
          textColor: '#000000',
        },
        '2698b84a-c121-47b2-8ff5-28a76c808958': {
          id: '2698b84a-c121-47b2-8ff5-28a76c808958',
          name: 'Important',
          version: 0,
          backgroundColor: '#a18fff',
          borderColor: '#8461f7',
          textColor: '#000000',
        },
      },
    };

    labels = [
      {
        id: '22fdcbda-6556-4940-8637-8af834499271',
        name: 'Area/Planner',
        version: 0,
        backgroundColor: '#d1d1d1',
        borderColor: '#bbbbbb',
        textColor: '#000000',
      },
      {
        id: '2698b84a-c121-47b2-8ff5-28a76c808958',
        name: 'Important',
        version: 0,
        backgroundColor: '#a18fff',
        borderColor: '#8461f7',
        textColor: '#000000',
      },
    ];
  });

  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = LabelReducer(undefined, action);

    expect(state).toBe(LabelInitialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = {
      ids: [],
      entities: {},
    };
    expect(LabelInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const action = new LabelActions.GetSuccess(labels);
    const state = LabelReducer(LabelInitialState, action);

    expect(state).toEqual(labelState);
  });

  it('GetError action should return previous state', () => {
    const action = new LabelActions.GetSuccess(labels);
    const state = LabelReducer(LabelInitialState, action);

    const getErrorAction = new LabelActions.GetError();
    const newState = LabelReducer(state, getErrorAction);

    expect(newState).toEqual(state);
  });

  it('AddSucess action should return new state', () => {
    const action = new LabelActions.AddSuccess(labels[0]);
    const state = LabelReducer(LabelInitialState, action);

    expect(state.ids).toContain('22fdcbda-6556-4940-8637-8af834499271');
    expect(state.entities['22fdcbda-6556-4940-8637-8af834499271']).toEqual(
      labelState.entities['22fdcbda-6556-4940-8637-8af834499271'],
    );
  });

  it('AddError action should return previous state', () => {
    const action = new LabelActions.GetSuccess(labels);
    const state = LabelReducer(LabelInitialState, action);

    const addErrorAction = new LabelActions.AddError();
    const newState = LabelReducer(state, addErrorAction);

    expect(newState).toEqual(state);
  });
});
