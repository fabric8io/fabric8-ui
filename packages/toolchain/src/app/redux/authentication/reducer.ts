import { produce } from 'immer';
import { AuthenticationActionTypes } from './actionTypes';
import { AuthenticationActions } from './actions';
import { AuthenticationState } from './state';

const INITIAL_STATE: AuthenticationState = {
  isLoggedIn: false,
};

export const authenticationReducer = (
  state: AuthenticationState = INITIAL_STATE,
  action: AuthenticationActions,
): AuthenticationState =>
  produce(state, (draft) => {
    switch (action.type) {
      case AuthenticationActionTypes.SET_AUTH_USER:
        draft.isLoggedIn = true;
        draft.userId = action.payload.userId;
        break;
      // no default
    }
    return undefined;
  });
