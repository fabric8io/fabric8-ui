import { Dispatch } from 'redux';
import { RedirectActions } from './actions';
import { RedirectActionTypes } from './actionTypes';

export const redirectMiddleware = () => (next: Dispatch) => (action: RedirectActions) => {
  if (action.type === RedirectActionTypes.REDIRECT) {
    window.location.href = action.payload.url;
  }
  next(action);
};
