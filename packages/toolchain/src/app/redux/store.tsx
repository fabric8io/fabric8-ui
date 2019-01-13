import React, { SFC } from 'react';
import { applyMiddleware, createStore, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { History } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';

export function createStoreProvider(history: History) {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)),
  );
  const StoreProvider: SFC = (props) => <Provider store={store} {...props} />;
  return StoreProvider;
}
