import { ActionsUnion, createAction } from '../../utils';
import { RedirectActionTypes } from './actionTypes';

// Actions

export const redirect = (url: string) => createAction(RedirectActionTypes.REDIRECT, { url });

const actions = {
  redirect,
};

export type RedirectActions = ActionsUnion<typeof actions>;
