import { getCurrentUserSpacesUrl, getCurrentUserUrl, getFeaturesUrl } from '../../api/api-urls';
import { fetchCollection, fetchEntity } from '../jsonapi/actions';
import { getCollectionEntityRefs } from '../jsonapi/selectors';
import { ThunkAction } from '../utils';

export function fetchCurrentUserSpaces(): ThunkAction {
  return async function(dispatch, getState) {
    await dispatch(fetchCollection(getCurrentUserSpacesUrl()));
    // The type of documents returned by /user/spaces is `resources` instead of `spaces`.
    // Read the IDs as space and fetch individually.
    const refs = getCollectionEntityRefs(getState(), getCurrentUserSpacesUrl());
    if (refs) {
      await Promise.all(refs.map((ref) => dispatch(fetchEntity('spaces', ref.id))));
    }
  };
}

export function fetchCurrentUser(): ThunkAction {
  return async function(dispatch) {
    await dispatch(fetchCollection(getCurrentUserUrl()));
  };
}

export function fetchUserById(id: string): ThunkAction {
  return async function(dispatch) {
    await dispatch(fetchEntity('identities', id));
  };
}

export function fetchFeatures(): ThunkAction {
  return async function(dispatch) {
    await dispatch(fetchCollection(getFeaturesUrl()));
  };
}
