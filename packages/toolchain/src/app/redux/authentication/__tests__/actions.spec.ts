import { CALL_HISTORY_METHOD } from 'connected-react-router';
import { mockStore, getAction } from '../../../../test/mockRedux';
import { mockLocation, mockLocalStorage } from '../../../../test/mockBrowser';
import * as actions from '../actions';
import { AuthenticationActionTypes } from '../actionTypes';
import { RedirectActionTypes } from '../../middleware/redirect';
import { LocalStorageActionTypes } from '../../middleware/localStorage';
import * as token from '../../../api/token';
import { getLoginAuthorizeUrl, getLogoutUrl } from '../../../api/api-urls';
import { AppState } from '../../appState';

jest.mock('../../wit/actions');

let mockToken;
let mockParsedToken;
let mockTokenInfo: token.TokenInfo;

jest.mock('../../../api/token', () => ({
  setAuthToken: jest.fn(),
  getAuthToken: jest.fn(() => mockToken),
  parseJwtToken: jest.fn(() => mockParsedToken),
  parseTokenInfoFromQuery: jest.fn(() => mockTokenInfo),
}));

describe('authentication actions', () => {
  beforeEach(() => {
    mockToken = undefined;
    mockParsedToken = undefined;
    mockTokenInfo = undefined;
  });

  it('should create setAuthUser action', () => {
    expect(actions.setAuthUser('test_user')).toEqual({
      type: AuthenticationActionTypes.SET_AUTH_USER,
      payload: {
        userId: 'test_user',
      },
    });
  });

  it('should handle logout action', async () => {
    mockLocation({
      origin: 'foobar',
    });

    const store = mockStore();
    store.dispatch(actions.logout());
    expect(await getAction(store, RedirectActionTypes.REDIRECT)).toEqual({
      type: RedirectActionTypes.REDIRECT,
      payload: {
        url: getLogoutUrl('foobar'),
      },
    });
    expect(token.setAuthToken).toHaveBeenCalledWith(null);
  });

  it('should handle login action with default url', async () => {
    mockLocation({
      pathname: '/foobar',
      search: '?key=value',
    });

    const store = mockStore();
    store.dispatch(actions.login());

    expect(await getAction(store, LocalStorageActionTypes.SET_ITEM)).toEqual({
      type: LocalStorageActionTypes.SET_ITEM,
      payload: {
        key: 'redirectUrl',
        value: '/foobar?key=value',
      },
    });
    expect(await getAction(store, RedirectActionTypes.REDIRECT)).toEqual({
      type: RedirectActionTypes.REDIRECT,
      payload: {
        url: getLoginAuthorizeUrl(),
      },
    });
  });

  it('should handle login action with specified url', async () => {
    const store = mockStore();
    store.dispatch(actions.login('/foo/bar'));

    expect(await getAction(store, LocalStorageActionTypes.SET_ITEM)).toEqual({
      type: LocalStorageActionTypes.SET_ITEM,
      payload: {
        key: 'redirectUrl',
        value: '/foo/bar',
      },
    });
    expect(await getAction(store, RedirectActionTypes.REDIRECT)).toEqual({
      type: RedirectActionTypes.REDIRECT,
      payload: {
        url: getLoginAuthorizeUrl(),
      },
    });
  });

  it('should do nothing if no auth token present and no redirect URL', () => {
    const store = mockStore();
    store.dispatch(actions.loginCheck());
    expect(store.getActions()).toHaveLength(0);
  });

  it('should handle user redirect', async () => {
    mockLocalStorage();
    localStorage.getItem = jest.fn((key) => (key === 'redirectUrl' ? '/test/path' : undefined));
    const store = mockStore();
    store.dispatch(actions.loginCheck());
    expect(await getAction(store, LocalStorageActionTypes.REMOVE_ITEM)).toEqual({
      type: LocalStorageActionTypes.REMOVE_ITEM,
      payload: {
        key: 'redirectUrl',
      },
    });
    expect(await getAction(store, CALL_HISTORY_METHOD)).toEqual({
      type: CALL_HISTORY_METHOD,
      payload: {
        method: 'push',
        args: ['/test/path'],
      },
    });
  });

  it('should use token from localStorage', async () => {
    mockParsedToken = {
      sub: 'user-id-value',
    };
    mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkLXZhbHVlIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.qzHkfToHSf49QqKIDlSj-L8YKfTg0vd0JkhOo4qMKsQ';

    const store = mockStore();
    store.dispatch(actions.loginCheck());
    expect(token.parseJwtToken).toHaveBeenCalledWith(mockToken);
    expect(await getAction(store, AuthenticationActionTypes.SET_AUTH_USER)).toEqual({
      type: AuthenticationActionTypes.SET_AUTH_USER,
      payload: {
        userId: 'user-id-value',
      },
    });
  });

  it('should use token from query string', async () => {
    mockParsedToken = {
      sub: 'user-id-value',
    };
    const mockToken =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyLWlkLXZhbHVlIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.qzHkfToHSf49QqKIDlSj-L8YKfTg0vd0JkhOo4qMKsQ';
    mockTokenInfo = {
      access_token: mockToken,
    };

    const queryString = `?token_json=${encodeURIComponent(`access_token=${mockToken}`)}`;
    const store = mockStore({
      router: {
        location: {
          search: queryString,
        },
      },
    } as AppState);
    store.dispatch(actions.loginCheck());
    expect(token.parseTokenInfoFromQuery).toHaveBeenCalledWith(queryString);

    expect(await getAction(store, AuthenticationActionTypes.SET_AUTH_USER)).toEqual({
      type: AuthenticationActionTypes.SET_AUTH_USER,
      payload: {
        userId: 'user-id-value',
      },
    });
    expect(await getAction(store, 'MOCK_WIT_FETCH_CURRENT_USER')).not.toBeUndefined();
  });

  // TODO test network exception case
  it('should use reset auth user on fetch fail', async () => {});
});
