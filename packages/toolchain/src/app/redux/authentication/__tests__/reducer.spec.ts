import { authenticationReducer } from '../reducer';
import { AuthenticationState } from '../state';
import { setAuthUser } from '../actions';

describe('authentication reducer', () => {
  it('should return initial state', () => {
    expect(authenticationReducer(undefined, {} as any)).toEqual({
      isLoggedIn: false,
    } as AuthenticationState);
  });

  it('should passthrough unhandled action', () => {
    const state = {} as any;
    expect(authenticationReducer(state, {} as any)).toBe(state);
  });

  it('should handle SET_AUTH_USER action', () => {
    expect(authenticationReducer({} as any, setAuthUser('foobar'))).toEqual({
      isLoggedIn: true,
      userId: 'foobar',
    } as AuthenticationState);
  });
});
