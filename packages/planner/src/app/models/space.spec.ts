import { Space } from 'ngx-fabric8-wit';
import { spaceSelector } from './space';

describe('SpaceQuery :: ', () => {
  it('Should return space from spaceSelector', () => {
    const state = {
      planner: {
        space: { id: 'space_id' },
      },
    };
    expect(spaceSelector(state)).toEqual({ id: 'space_id' } as Space);
  });

  it('Should return epty object from spaceSelector if `planner` is not there in the state', () => {
    const state = {
      detailsPage: {},
    };
    expect(spaceSelector(state)).toEqual({} as Space);
  });
});
