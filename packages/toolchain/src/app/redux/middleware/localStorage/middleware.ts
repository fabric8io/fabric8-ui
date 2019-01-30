import { Dispatch } from 'redux';
import { LocalStorageActions } from './actions';
import { LocalStorageActionTypes } from './actionTypes';

export const localStorageMiddleware = () => (next: Dispatch) => (action: LocalStorageActions) => {
  switch (action.type) {
    case LocalStorageActionTypes.SET_ITEM:
      localStorage.setItem(action.payload.key, action.payload.value);
      break;
    case LocalStorageActionTypes.REMOVE_ITEM:
      localStorage.removeItem(action.payload.key);
      break;
    // no default
  }
  next(action);
};
