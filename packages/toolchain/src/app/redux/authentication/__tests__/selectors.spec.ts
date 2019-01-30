import * as selectors from '../selectors';
import { AppState } from '../../appState';

describe('authentication selectors', () => {
  it('should return isLoggedIn', () => {
    expect(
      selectors.isLoggedIn({
        authentication: {
          isLoggedIn: false,
          userId: '',
        },
      } as AppState),
    ).toBe(false);
  });

  it('should return authenticated userId', () => {
    expect(
      selectors.getAuthenticatedUserId({
        authentication: {
          isLoggedIn: false,
          userId: 'foobar',
        },
      } as AppState),
    ).toBe('foobar');
  });
});
