import { AreaState } from './../states/area.state';
import { Get, GET, GET_ERROR, GET_SUCCESS, GetError, GetSuccess } from './area.actions';

describe('Unit Test :: Area Actions', () => {
  it('GetArea :: should create get action', () => {
    const action = new Get();
    expect({ ...action }).toEqual({ type: GET });
  });

  it('GetAreaSuccess :: should create get success action', () => {
    const areas = {
      'area-1': {
        id: 'area-1',
        name: 'Area 1',
        parentPath: '/',
        parentPathResolved: '/',
      },
    } as AreaState;

    const action = new GetSuccess(areas);
    expect({ ...action }).toEqual({
      type: GET_SUCCESS,
      payload: areas,
    });
  });

  it('GetAreaError :: should create get error action', () => {
    const action = new GetError();
    expect({ ...action }).toEqual({ type: GET_ERROR });
  });
});
