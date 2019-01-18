import { AppState } from '../appState';
import { ResourceObject } from '../../api/models/jsonapi';
import { Entity, EntityRef } from './state';

export const first = <R extends any>(arr: R | R[]): R => (Array.isArray(arr) ? arr[0] : arr);

export const getEntity = <R extends ResourceObject>(
  state: AppState,
  type: string,
  id: string,
): Entity<R> => (state.jsonapi.entities[type] ? state.jsonapi.entities[type][id] : undefined);

export const getEntityResource = <R extends ResourceObject>(
  state: AppState,
  type: string,
  id: string,
): R | undefined =>
  state.jsonapi.entities[type] &&
  state.jsonapi.entities[type][id] &&
  state.jsonapi.entities[type][id].resource;

export const getEntities = <R extends ResourceObject>(
  state: AppState,
  entities: EntityRef[],
): Entity<R>[] =>
  entities ? entities.map((ref) => getEntity<R>(state, ref.type, ref.id)).filter((x) => !!x) : [];

export const getEntityResources = <R extends ResourceObject>(
  state: AppState,
  entities: EntityRef[],
): R[] =>
  entities
    ? entities.map((ref) => getEntityResource<R>(state, ref.type, ref.id)).filter((x) => !!x)
    : [];

export const getCollection = (state: AppState, path: string) => state.jsonapi.collections[path];

export const getCollectionEntities = <R extends ResourceObject>(
  state: AppState,
  path: string,
): Entity<R>[] => getEntities<R>(state, getCollectionEntityRefs(state, path));

export const getCollectionResources = <R extends ResourceObject>(
  state: AppState,
  path: string,
): R[] => getEntityResources<R>(state, getCollectionEntityRefs(state, path));

export const getCollectionEntityRefs = (state: AppState, path: string): EntityRef[] =>
  state.jsonapi.collections[path] && state.jsonapi.collections[path].entities;
