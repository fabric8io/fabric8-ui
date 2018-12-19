import * as EventActions from './../actions/event.action';
import { EventUI } from './../models/event.model';
import { EventState, initialState as EventInitialState } from './../states/event.state';
import { EventReducer } from './event.reducer';

export type Action = EventActions.All;

describe('EventReducer :: Unit Test', () => {
  it('undefined action should return the default state', () => {
    const action = {} as Action;
    const state = EventReducer(undefined, action);

    expect(state).toBe(EventInitialState);
  });

  it('Initial state should be an empty array', () => {
    const initialState = [];
    expect(EventInitialState).toEqual(initialState);
  });

  it('GetSuccess action should return new state', () => {
    const event: EventUI[] = [
      {
        name: 'system.title',
        newValue: 'a',
        oldValue: 'b',
        timestamp: '2018-05-27T08:54:44.63509Z',
        modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
        newValueRelationships: null,
        oldValueRelationships: null,
        type: null,
      },
    ];

    const action = new EventActions.GetSuccess(event);
    const state = EventReducer(EventInitialState, action);

    expect(state).toEqual(event);
  });

  it('GetError Action should return previous state', () => {
    const previousState: EventUI[] = [
      {
        name: 'system.title',
        newValue: 'a',
        oldValue: 'b',
        timestamp: '2018-05-27T08:54:44.63509Z',
        modifierId: '20694424-0841-4d6c-bfb5-bbbb0391b8db',
        newValueRelationships: null,
        oldValueRelationships: null,
        type: null,
      },
    ];
    const action = new EventActions.GetError();
    const state = EventReducer(previousState, action);

    expect(state).toEqual(state);
  });
});
