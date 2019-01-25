import { applyMiddleware, createStore, compose, Store, AnyAction } from 'redux';
import thunk from 'redux-thunk';
import { History } from 'history';
import { routerMiddleware } from 'connected-react-router';
import createRootReducer from './reducers';
import { AppState } from './appState';

export function configureStore(history: History): Store<AppState, AnyAction> {
  // eslint-disable-next-line no-underscore-dangle
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  const store = createStore(
    createRootReducer(history),
    composeEnhancers(applyMiddleware(routerMiddleware(history), thunk)),
  );
  return store;
}
