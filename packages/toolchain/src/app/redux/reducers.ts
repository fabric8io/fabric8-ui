import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import { History } from 'history';
import { AppState } from './appState';
import { jsonapiReducer } from './jsonapi/reducer';
import { authenticationReducer } from './authentication/reducer';
import { contextReducer } from './context/reducer';

export default (history: History) =>
  combineReducers<AppState>({
    router: connectRouter(history),
    jsonapi: jsonapiReducer,
    authentication: authenticationReducer,
    context: contextReducer,
  });
