import { createSelector } from 'reselect';
import { getCurrentUserSpacesUrl, getCurrentUserUrl } from '../../api/api-urls';
import { UserResource } from '../../api/models';
import { AppState } from '../appState';
import { getCollectionEntityRefs, getEntityResources, first } from '../jsonapi/selectors';

const getSpaceEntitiesMap = (state: AppState) => state.jsonapi.entities.spaces || {};
const getUserEntitiesMap = (state: AppState) => state.jsonapi.entities.identities || {};
const getFeatureEntitiesMap = (state: AppState) => state.jsonapi.entities.features || {};

export const getCurrentUserSpaces = createSelector(
  getSpaceEntitiesMap,
  (state: AppState) => getCollectionEntityRefs(state, getCurrentUserSpacesUrl()),
  (map, refs = []) => refs.map((ref) => map[ref.id] && map[ref.id].resource).filter((x) => !!x),
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

export const getFeatureById = createSelector(
  getFeatureEntitiesMap,
  (_: AppState, id: string) => id,
  (map, id) => map[id] && map[id].resource,
);
