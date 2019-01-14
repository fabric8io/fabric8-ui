import { AnyAction } from 'redux';
import { ThunkAction as ReduxThunkAction, ThunkDispatch as ReduxThunkDispatch } from 'redux-thunk';
import { AppState } from './appState';

export type ThunkDispatch = ReduxThunkDispatch<AppState, undefined, AnyAction>;

export type ThunkAction<R = void> = ReduxThunkAction<R, AppState, undefined, AnyAction>;

export type Action<T extends string = string, P = void> = P extends void
  ? Readonly<{ type: T }>
  : Readonly<{ type: T; payload: P }>;

export type ActionsUnion<A extends { [key: string]: (...args: any[]) => any }> = ReturnType<
  A[keyof A]
>;

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(type: T, payload: P): Action<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  const action = payload === undefined ? { type } : { type, payload };
  return process.env.NODE_ENV === 'production' ? action : Object.freeze(action);
}
