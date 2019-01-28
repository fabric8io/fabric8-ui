import { ThunkAction, createAction } from '../../utils';

export function fetchCurrentUser(): ThunkAction {
  return function(dispatch) {
    dispatch(createAction('MOCK_WIT_FETCH_CURRENT_USER'));
  };
}
