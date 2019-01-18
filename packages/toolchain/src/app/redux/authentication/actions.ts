import { push } from 'connected-react-router';
import { getLoginAuthorizeUrl, getLogoutUrl } from '../../api/api-urls';
import {
  setAuthToken,
  getAuthToken,
  parseTokenInfoFromQuery,
  parseJwtToken,
} from '../../api/token';
import { ThunkAction, ActionsUnion, createAction } from '../utils';
import { fetchCurrentUser } from '../wit/actions';
import { AuthenticationActionTypes } from './actionTypes';

// Actions

const setAuthUser = (userId: string) =>
  createAction(AuthenticationActionTypes.SET_AUTH_USER, { userId });

const actions = {
  setAuthUser,
};

export type AuthenticationActions = ActionsUnion<typeof actions>;

// Thunks

export function loginCheck(): ThunkAction {
  return async function(dispatch, getState) {
    function redirectPostLogin() {
      const redirectUrl = localStorage.getItem('redirectUrl');
      localStorage.removeItem('redirectUrl');
      if (redirectUrl) {
        dispatch(push(redirectUrl));
      }
    }

    let token = getAuthToken();
    if (!token) {
      const tokenInfo = parseTokenInfoFromQuery(getState().router.location.search);
      if (tokenInfo) {
        token = tokenInfo.access_token;
      }
    }

    if (token) {
      const data = parseJwtToken(token);
      dispatch(setAuthUser(data.sub));
    }

    redirectPostLogin();

    if (token) {
      try {
        await dispatch(fetchCurrentUser());
      } catch (e) {
        // invalid token
        setAuthToken(null);
        dispatch(login());
      }
    }
  };
}

export function login(url: string = `${window.location.pathname}${location.search}`): ThunkAction {
  return function() {
    localStorage.setItem('redirectUrl', url);
    window.location.href = getLoginAuthorizeUrl();
  };
}

export function logout(): ThunkAction {
  return async function() {
    setAuthToken(null);
    window.location.href = getLogoutUrl(window.location.origin);
  };
}
