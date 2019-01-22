import {
  getCurrentUserSpacesUrl,
  getCurrentUserUrl,
  getFeaturesUrl,
  getNamedSpacesUrl,
} from '../../api/api-urls';
import { fetchCollection, fetchEntity } from '../jsonapi/actions';
import { getCollectionEntityRefs } from '../jsonapi/selectors';
import { ThunkAction } from '../utils';
import { getSpaceById } from './selectors';

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

export function fetchUserSpacesByUsername(username: string): ThunkAction {
  return async function(dispatch) {
    await dispatch(fetchCollection(getNamedSpacesUrl(username)));
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

export function fetchSpaceById(id: string): ThunkAction {
  return async function(dispatch) {
    await dispatch(fetchEntity('spaces', id));
  };
}

export function fetchSpaceOwner(id: string): ThunkAction {
  return async function(dispatch, getState) {
    await dispatch(fetchSpaceById(id));
    const space = getSpaceById(getState(), id);
    if (space) {
      await dispatch(fetchUserById(space.relationships['owned-by'].data.id));
    }
  };
}
