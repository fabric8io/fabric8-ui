import { push } from 'connected-react-router';
import { fetch } from '../../api/http.client';
import { getLoginAuthorizeUrl, getLogoutUrl } from '../../api/api-urls';
import {
  setAuthToken,
  getAuthToken,
  parseTokenInfoFromQuery,
  parseJwtToken,
} from '../../api/token';
import { ThunkAction, ActionsUnion, createAction } from '../utils';
import { fetchCurrentUser } from '../wit/actions';
import { redirect } from '../middleware/redirect/actions';
import { setLocalStorageItem, removeLocalStorageItem } from '../middleware/localStorage/actions';
import { AuthenticationActionTypes } from './actionTypes';

const REDIRECT_URL_KEY = 'redirectUrl';

// Actions

export const setAuthUser = (userId: string) =>
  createAction(AuthenticationActionTypes.SET_AUTH_USER, { userId });

const actions = {
  setAuthUser,
};

export type AuthenticationActions = ActionsUnion<typeof actions>;

// Thunks

export function loginCheck(): ThunkAction {
  return async function(dispatch, getState) {
    function redirectPostLogin() {
      const redirectUrl = localStorage.getItem(REDIRECT_URL_KEY);
      if (redirectUrl) {
        dispatch(removeLocalStorageItem(REDIRECT_URL_KEY));
        dispatch(push(redirectUrl));
      }
    }

    let token = getAuthToken();
    if (!token) {
      const { router } = getState();
      if (router) {
        const tokenInfo = parseTokenInfoFromQuery(router.location.search);
        if (tokenInfo) {
          token = tokenInfo.access_token;
        }
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
  return function(dispatch) {
    dispatch(setLocalStorageItem(REDIRECT_URL_KEY, url));
    dispatch(redirect(getLoginAuthorizeUrl()));
  };
}

export function logout(): ThunkAction {
  return async function(dispatch) {
    const logoutUrl = getLogoutUrl(window.location.origin);
    const result = await fetch<{ redirect_location: string }>(logoutUrl);
    setAuthToken(null);
    dispatch(redirect(result.redirect_location));
  };
}
