import { ThunkAction } from 'redux-thunk';
import { DataDocument, ErrorObject, JsonApiError } from '../../api/models/jsonapi';
import { fetchDocument as fetchDocumentApi } from '../../api/jsonapi.client';
import { AppState } from '../appState';
import { createAction, ActionsUnion } from '../utils';
import { JsonapiActionTypes } from './actionTypes';
import { getEntity, getCollection } from './selectors';
import { getEntityUrl } from '../../api/api-urls';

// Actions

const requestEntity = (type: string, id: string) =>
  createAction(JsonapiActionTypes.REQUEST_ENTITY, { type, id });

const receivedEntity = (
  type: string,
  id: string,
  dataDocument: DataDocument,
  receivedAt: number = Date.now(),
) =>
  createAction(JsonapiActionTypes.RECEIVED_ENTITY, {
    type,
    id,
    dataDocument,
    receivedAt,
  });

const receivedEntityError = (
  type: string,
  id: string,
  error: ErrorObject,
  receivedAt: number = Date.now(),
) =>
  createAction(JsonapiActionTypes.RECEIVED_ENTITY_ERROR, {
    type,
    id,
    error,
    receivedAt,
  });

const invalidateEntity = (type: string, id: string) =>
  createAction(JsonapiActionTypes.INVALIDATE_ENTITY, { type, id });

const requestCollection = (url: string) =>
  createAction(JsonapiActionTypes.REQUEST_COLLECTION, { url });

const receivedCollection = (
  url: string,
  dataDocument: DataDocument,
  receivedAt: number = Date.now(),
) =>
  createAction(JsonapiActionTypes.RECEIVED_COLLECTION, {
    url,
    dataDocument,
    receivedAt,
  });

const receivedCollectionError = (
  url: string,
  error: ErrorObject,
  receivedAt: number = Date.now(),
) =>
  createAction(JsonapiActionTypes.RECEIVED_COLLECTION_ERROR, {
    url,
    error,
    receivedAt,
  });

const invalidateCollection = (url: string) =>
  createAction(JsonapiActionTypes.INVALIDATE_COLLECTION, { url });

const requestNextCollection = (url: string) =>
  createAction(JsonapiActionTypes.REQUEST_NEXT_COLLECTION, { url });

const receivedNextCollection = (
  url: string,
  dataDocument: DataDocument,
  receivedAt: number = Date.now(),
) =>
  createAction(JsonapiActionTypes.RECEIVED_NEXT_COLLECTION, {
    url,
    dataDocument,
    receivedAt,
  });

// const requestPrevCollection = (url: string) =>
//   createAction(JsonapiActionTypes.REQUEST_PREV_COLLECTION, { url });

// const receivedPrevCollection = (dataDocument: DataDocuments, receivedAt: number = Date.now()) =>
//   createAction(JsonapiActionTypes.RECEIVED_PREV_COLLECTION, {
//     dataDocument,
//     receivedAt,
//   });

const actions = {
  requestEntity,
  receivedEntity,
  receivedEntityError,
  invalidateEntity,
  requestCollection,
  receivedCollection,
  receivedCollectionError,
  invalidateCollection,
  requestNextCollection,
  receivedNextCollection,
  // requestPrevCollection,
  // receivedPrevCollection,
};

export type JsonapiActions = ActionsUnion<typeof actions>;

// Thunks

type ThunkResult = ThunkAction<void, AppState, undefined, JsonapiActions>;

const TTL = 10 * 60 * 1000;

export function fetchEntity(type: string, id: string): ThunkResult {
  return async function(dispatch, getState) {
    const appState = getState();
    const entity = getEntity(appState, type, id);
    if (
      !entity ||
      (!entity.isFetching && (entity.didInvalidate || Date.now() - entity.lastUpdated > TTL))
    ) {
      const url = getEntityUrl(type, id);

      // update the entity request
      dispatch(requestEntity(type, id));
      if (process.env.NODE_ENV !== 'production') {
        dispatch(requestCollection(url));
      }

      try {
        const result = await fetchDocumentApi(url);
        const receivedAt = Date.now();
        dispatch(receivedEntity(type, id, result, receivedAt));
        if (process.env.NODE_ENV !== 'production') {
          dispatch(receivedCollection(url, result, receivedAt));
        }
      } catch (e) {
        const jsonApiError = e as JsonApiError;
        const receivedAt = Date.now();
        dispatch(receivedEntityError(type, id, jsonApiError.error, receivedAt));
        if (process.env.NODE_ENV !== 'production') {
          dispatch(receivedCollectionError(url, jsonApiError.error, receivedAt));
        }
      }
    }
  };
}

export function fetchCollection(url: string): ThunkResult {
  return async function(dispatch, getState) {
    const appState = getState();
    const collection = getCollection(appState, url);
    if (
      !collection ||
      (!collection.isFetching &&
        (collection.didInvalidate || Date.now() - collection.lastUpdated > TTL))
    ) {
      dispatch(requestCollection(url));

      try {
        const result = await fetchDocumentApi(url);
        dispatch(receivedCollection(url, result));
      } catch (e) {
        const jsonApiError = e as JsonApiError;
        dispatch(receivedCollectionError(url, jsonApiError.error));
      }
    }
  };
}

export function fetchNextCollection(url: string): ThunkResult {
  return async function(dispatch, getState) {
    const appState = getState();
    const collection = getCollection(appState, url);
    if (collection && collection.pageInfo.hasNextPage && !collection.pageInfo.isFetchingNextPage) {
      dispatch(requestNextCollection(url));

      const result = await fetchDocumentApi(collection.pageInfo.nextPage);

      dispatch(receivedNextCollection(url, result));
    }
  };
}

// export function fetchPrevCollection(url: string): ThunkResult {
//   return async function(dispatch, getState) {
//     const appState = getState();
//     const collection = getCollection(appState, url);
//     if (collection && collection.pageInfo.hasPrevPage && !collection.pageInfo.isFetchingPrevPage) {
//       dispatch(requestPrevCollection(url));

//       const result = await fetchByUrlApi(collection.pageInfo.prevPage);

//       dispatch(receivedPrevCollection(result));
//     }
//   };
// }
