import * as token from '../token';
import { mockLocalStorage } from '../../../test/mockBrowser';

describe('token', () => {
  it('should get auth token from localstorage', () => {
    mockLocalStorage();
    localStorage.getItem = jest.fn((key: string) => (key === 'auth_token' ? 'foobar' : undefined));
    expect(token.getAuthToken()).toBe('foobar');
    expect(localStorage.getItem).toHaveBeenCalledWith('auth_token');
  });

  it('should set token to local stoarge', () => {
    mockLocalStorage();
    token.setAuthToken(null);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth_token');
    token.setAuthToken('foobar');
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'foobar');
  });

  it('should parse token info from query string', () => {
    mockLocalStorage();
    expect(token.parseTokenInfoFromQuery('')).toBeUndefined();
    expect(token.parseTokenInfoFromQuery('foobar')).toBeUndefined();
    expect(token.parseTokenInfoFromQuery('?token_json=foobar')).toBeUndefined();
    expect(
      token.parseTokenInfoFromQuery(
        `?token_json=${encodeURIComponent(
          JSON.stringify({
            access_token: 'foo',
            refresh_token: 'bar',
          }),
        )}`,
      ),
    ).toEqual({
      access_token: 'foo',
      refresh_token: 'bar',
    });
    expect(localStorage.setItem).toHaveBeenCalledWith('auth_token', 'foo');
    expect(localStorage.setItem).toHaveBeenCalledWith('refresh_token', 'bar');
  });

  it('should parse jwt token', () => {
    // TODO
  });
});
