import thunk, { ThunkDispatch } from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { AnyAction } from 'redux';

type DispatchExts = ThunkDispatch<any, undefined, AnyAction>;

export const mockStore = function<State = {}>(state?: State) {
  return configureMockStore<State, DispatchExts>([thunk])(state);
};

function findAction(store, type) {
  return store.getActions().find((action) => action.type === type);
}

export function getAction(store, type) {
  const action = findAction(store, type);
  if (action) {
    return Promise.resolve(action);
  }

  return new Promise((resolve) => {
    store.subscribe(() => {
      const action = findAction(store, type);
      if (action) resolve(action);
    });
  });
}
