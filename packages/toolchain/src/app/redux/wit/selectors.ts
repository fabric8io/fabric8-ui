import { createSelector } from 'reselect';
import {
  getCurrentUserSpacesUrl,
  getCurrentUserUrl,
  getFeaturesUrl,
  getNamedSpacesUrl,
} from '../../api/api-urls';
import { UserResource } from '../../api/models';
import { AppState } from '../appState';
import { getCollectionEntityRefs, getEntityResources, first } from '../jsonapi/selectors';

const getSpaceEntitiesMap = (state: AppState) => state.jsonapi.entities.spaces || {};
const getUserEntitiesMap = (state: AppState) => state.jsonapi.entities.identities || {};
const getFeatureEntitiesMap = (state: AppState) => state.jsonapi.entities.features || {};

export const getCurrentUserSpaces = createSelector(
  getSpaceEntitiesMap,
  (state: AppState) => getCollectionEntityRefs(state, getCurrentUserSpacesUrl()),
  (map, refs = []) =>
    refs
      .map((ref) => map[ref.id] && map[ref.id].resource)
      .filter((x) => !!x)
      .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name)),
);

export const getUserSpaces = (state: AppState, username: string) => {
  const refs = getCollectionEntityRefs(state, getNamedSpacesUrl(username));
  if (refs) {
    const map = getSpaceEntitiesMap(state);
    return refs
      .map((ref) => map[ref.id] && map[ref.id].resource)
      .filter((x) => !!x)
      .sort((a, b) => a.attributes.name.localeCompare(b.attributes.name));
  }
  return [];
};

export const getSpaceById = createSelector(
  getSpaceEntitiesMap,
  (_: AppState, id: string) => id,
  (map, id) => map[id] && map[id].resource,
);

export const getCurrentUser = (state: AppState) =>
  first(
    getEntityResources<UserResource>(state, getCollectionEntityRefs(state, getCurrentUserUrl())),
  );

export const getUserById = createSelector(
  getUserEntitiesMap,
  (_: AppState, id: string) => id,
  (map, id) => map[id] && map[id].resource,
);

export const getUserByUsername = createSelector(
  getUserEntitiesMap,
  (_: AppState, username: string) => username,
  (map, username) =>
    Object.keys(map).find(
      (id) => map[id].resource && map[id].resource.attributes.username === username,
    ),
);

export const getFeatureById = createSelector(
  getFeatureEntitiesMap,
  (_: AppState, id: string) => id,
  (map, id) => map[id] && map[id].resource,
);

export const getFeatureCollection = (state: AppState) =>
  state.jsonapi.collections[getFeaturesUrl()];
