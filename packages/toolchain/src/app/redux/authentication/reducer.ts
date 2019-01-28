import { AuthenticationActionTypes } from './actionTypes';
import { AuthenticationActions } from './actions';
import { AuthenticationState } from './state';

const INITIAL_STATE: AuthenticationState = {
  isLoggedIn: false,
};

export const authenticationReducer = (
  state: AuthenticationState = INITIAL_STATE,
  action: AuthenticationActions,
): AuthenticationState => {
  switch (action.type) {
    case AuthenticationActionTypes.SET_AUTH_USER:
      return {
        isLoggedIn: true,
        userId: action.payload.userId,
      };
    default:
      return state;
  }
};
