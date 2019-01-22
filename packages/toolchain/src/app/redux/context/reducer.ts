import { matchPath } from 'react-router';
import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { ContextState } from './state';
import { NO_SPACE_PATH } from './constants';

const INITIAL_STATE: ContextState = {
  spacenamePath: NO_SPACE_PATH,
  subPath: '',
};

interface MatchParams {
  username: string;
  spacename: string;
  subPath: string;
}

function getContext(currentState: ContextState, pathname: string): ContextState {
  let matchResult = matchPath<MatchParams>(pathname, {
    path: `/:username([^_][^/]+)/:spacename([^_][^/]+|${NO_SPACE_PATH})/:subPath(.*)?`,
    exact: false,
    strict: false,
  });

  if (!matchResult) {
    matchResult = matchPath<MatchParams>(pathname, {
      path: '/:username([^_][^/]+)/:subPath(.*)?',
      exact: false,
      strict: false,
    });
  }

  const username = matchResult ? matchResult.params.username : undefined;
  const spacename =
    matchResult && matchResult.params.spacename !== NO_SPACE_PATH
      ? matchResult.params.spacename
      : undefined;
  const subPath = matchResult ? matchResult.params.subPath : pathname;
  const spacenamePath = spacename || NO_SPACE_PATH;

  return {
    username,
    spacename,
    subPath,
    spacenamePath,
  };
}

export const contextReducer = (
  state: ContextState = INITIAL_STATE,
  action: LocationChangeAction,
): ContextState => {
  switch (action.type) {
    case LOCATION_CHANGE:
      return {
        ...state,
        ...getContext(state, action.payload.location.pathname),
      };
    default:
      return state;
  }
};
