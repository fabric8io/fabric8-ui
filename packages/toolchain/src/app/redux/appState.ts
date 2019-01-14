import { JsonapiState } from './jsonapi/state';
import { AuthenticationState } from './authentication/state';
import { ContextState } from './context/state';

export interface RouterState {
  location: {
    pathname: string;
    search: string;
    hash: string;
  };
}

export interface AppState {
  router: RouterState;
  jsonapi: JsonapiState;
  authentication: AuthenticationState;
  context: ContextState;
}
