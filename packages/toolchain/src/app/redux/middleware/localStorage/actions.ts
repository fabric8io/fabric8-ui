import { ActionsUnion, createAction } from '../../utils';
import { LocalStorageActionTypes } from './actionTypes';

// Actions

export const setLocalStorageItem = (key: string, value: string) =>
  createAction(LocalStorageActionTypes.SET_ITEM, { key, value });

export const removeLocalStorageItem = (key: string) =>
  createAction(LocalStorageActionTypes.REMOVE_ITEM, { key });

const actions = {
  setLocalStorageItem,
  removeLocalStorageItem,
};

export type LocalStorageActions = ActionsUnion<typeof actions>;
