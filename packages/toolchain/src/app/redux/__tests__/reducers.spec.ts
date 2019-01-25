import { createBrowserHistory } from 'history';
import createRootReducer from '../reducers';

describe('root reducer', () => {
  it('should create root reducer', () => {
    const rootReducer = createRootReducer(createBrowserHistory());
    expect(rootReducer(undefined, { type: 'unknown' })).toEqual({
      authentication: { isLoggedIn: false },
      context: { spacenamePath: '_landing', subPath: '' },
      jsonapi: { collections: {}, entities: {} },
      router: {
        action: 'POP',
        location: { hash: '', pathname: '/', search: '', state: undefined },
      },
    });
  });
});
