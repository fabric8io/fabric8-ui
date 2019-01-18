import { EventUI } from './../models/event.model';
import { Get, GET, GET_ERROR, GET_SUCCESS, GetError, GetSuccess } from './event.action';

describe('Unit Test :: Event Actions', () => {
  it('GetEvent :: should create get action', () => {
    const url = 'https://mock';
    const action = new Get(url);
    expect({ ...action }).toEqual({
      payload: url,
      type: GET,
    });
  });

  it('GetEventSuccess :: should create get success action', () => {
    const event = [
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
    ] as EventUI[];
    const action = new GetSuccess(event);
    expect({ ...action }).toEqual({
      type: GET_SUCCESS,
      payload: event,
    });
  });

  it('GetEventError :: should create get error action', () => {
    const action = new GetError();
    expect({ ...action }).toEqual({ type: GET_ERROR });
  });
});
