import { produce } from 'immer';
import { JsonapiActionTypes } from './actionTypes';
import { JsonapiActions } from './actions';
import { JsonapiState, Collection, EntityRef } from './state';
import { DataDocument, ResourceObject } from '../../api/models/jsonapi';

const INITIAL_STATE: JsonapiState = {
  entities: {},
  collections: {},
};

function updatePaginationLinks(draft: Collection, resource: DataDocument) {
  if (resource.links) {
    if (resource.links.next) {
      draft.pageInfo = {
        ...draft.pageInfo,
        hasNextPage: true,
        nextPage: resource.links.next,
      };
    }
    if (resource.links.prev) {
      draft.pageInfo = {
        ...draft.pageInfo,
        hasPrevPage: true,
        prevPage: resource.links.prev,
      };
    }
  }
}

function addOrUpdateEntities(draft: JsonapiState, receivedAt: number, resource: ResourceObject) {
  const { id } = resource;
  const { type } = resource;
  if (!draft.entities[type]) {
    draft.entities[type] = {};
  }
  draft.entities[type][id] = {
    ...draft.entities[type][id],
    lastUpdated: receivedAt,
    isFetching: false,
    resource,
    // If we have no attributes, it's probably just a reference document and needs to be updated.
    didInvalidate: !resource.attributes,
  };
}

function addEntities(draft: JsonapiState, receivedAt: number, dataDocument: DataDocument) {
  if (Array.isArray(dataDocument.data)) {
    dataDocument.data.forEach((data) => addOrUpdateEntities(draft, receivedAt, data));
  } else {
    addOrUpdateEntities(draft, receivedAt, dataDocument.data);
  }
  if (dataDocument.included) {
    dataDocument.included.forEach((data) => addOrUpdateEntities(draft, receivedAt, data));
  }
}

function getSelfUrl(resource: ResourceObject): string | undefined {
  if (resource.links) {
    const { self } = resource.links;
    if (typeof self === 'string') {
      return self;
    }
    if (self && self.href) {
      return self.href;
    }
  }
  return undefined;
}

function getEntityRefs(dataDocument: DataDocument): EntityRef[] {
  if (Array.isArray(dataDocument.data)) {
    return dataDocument.data.map((data) => ({
      type: data.type,
      id: data.id,
      self: getSelfUrl(data),
    }));
  }
  return [
    {
      type: dataDocument.data.type,
      id: dataDocument.data.id,
      self: getSelfUrl(dataDocument.data),
    },
  ];
}

export const jsonapiReducer = (
  state: JsonapiState = INITIAL_STATE,
  action: JsonapiActions,
): JsonapiState =>
  produce(state, (draft) => {
    switch (action.type) {
      case JsonapiActionTypes.REQUEST_ENTITY:
        {
          let typeMap = draft.entities[action.payload.type];
          if (!typeMap) {
            typeMap = {};
            draft.entities[action.payload.type] = typeMap;
          }
          const entity = typeMap[action.payload.id];
          if (!entity) {
            typeMap[action.payload.id] = {
              ...action.payload,
              isFetching: true,
              lastUpdated: 0,
            };
          } else {
            entity.isFetching = true;
            entity.didInvalidate = false;
          }
        }
        break;

      case JsonapiActionTypes.RECEIVED_ENTITY:
        addEntities(draft, action.payload.receivedAt, action.payload.dataDocument);
        break;

      case JsonapiActionTypes.INVALIDATE_ENTITY:
        if (
          draft.entities[action.payload.type] &&
          draft.entities[action.payload.type][action.payload.id]
        ) {
          draft.entities[action.payload.type][action.payload.id].didInvalidate = true;
        }
        break;

      case JsonapiActionTypes.REQUEST_COLLECTION:
        if (!draft.collections[action.payload.url]) {
          draft.collections[action.payload.url] = {
            ...action.payload,
            isFetching: true,
            lastUpdated: 0,
            totalCount: 0,
          };
        } else {
          draft.collections[action.payload.url] = {
            ...draft.collections[action.payload.url],
            isFetching: true,
            didInvalidate: false,
          };
        }
        break;

      case JsonapiActionTypes.RECEIVED_COLLECTION:
        {
          const collection = draft.collections[action.payload.url];
          collection.isFetching = false;
          collection.entities = getEntityRefs(action.payload.dataDocument);
          collection.totalCount = action.payload.dataDocument.meta
            ? action.payload.dataDocument.meta.totalCount
            : collection.entities.length;
          updatePaginationLinks(collection, action.payload.dataDocument);
          addEntities(draft, action.payload.receivedAt, action.payload.dataDocument);
        }
        break;

      case JsonapiActionTypes.INVALIDATE_COLLECTION:
        {
          const collection = draft.collections[action.payload.url];
          if (collection) {
            collection.didInvalidate = true;
          }
        }
        break;

      case JsonapiActionTypes.REQUEST_NEXT_COLLECTION:
        draft.collections[action.payload.url].pageInfo.isFetchingNextPage = true;
        break;

      case JsonapiActionTypes.RECEIVED_NEXT_COLLECTION:
        {
          const collection = draft.collections[action.payload.url];
          collection.pageInfo.isFetchingNextPage = false;
          collection.lastUpdated = action.payload.receivedAt;
          collection.entities = [
            ...collection.entities,
            ...getEntityRefs(action.payload.dataDocument),
          ];
          updatePaginationLinks(collection, action.payload.dataDocument);
          addEntities(draft, action.payload.receivedAt, action.payload.dataDocument);
        }
        break;

      // case JsonapiActionTypes.REQUEST_PREV_COLLECTION:
      //   draft.collections[action.payload.url].pageInfo.isFetchingPrevPage = true;
      //   break;

      // case JsonapiActionTypes.RECEIVED_PREV_COLLECTION:
      // {
      //   const collection = draft.collections[action.payload.url];
      //   collection.pageInfo.isFetchingPrevPage = false;
      //   collection.lastUpdated = action.payload.receivedAt;
      //   collection.entities = [
      //     ...getEntityRefs(action.payload.dataDocument),
      //     ...collection.entities,
      //   ];
      //   updatePaginationLinks(collection, action.payload.dataDocument);
      // }
      // break;
      // no default
    }
    return undefined;
  });

// REQUEST_ENTITY = '@Jsonapi:REQUEST_ENTITY',
// RECEIVED_ENTITY = '@Jsonapi:RECEIVED_ENTITY',
// INVALIDATE_ENTITY = '@Jsonapi:INVALIDATE_ENTITY',

// REQUEST_COLLECTION = '@Jsonapi:REQUEST_COLLECTION',
// RECEIVED_COLLECTION = '@Jsonapi:RECEIVED_COLLECTION',
// INVALIDATE_COLLECTION = '@Jsonapi:INVALIDATE_COLLECTION',

// REQUEST_NEXT_COLLECTION = '@Jsonapi:REQUEST_NEXT_COLLECTION',
// RECEIVED_NEXT_COLLECTION = '@Jsonapi:RECEIVED_NEXT_COLLECTION',

// // REQUEST_PREV_COLLECTION = '@Jsonapi:REQUEST_PREV_COLLECTION',
// // RECEIVED_PREV_COLLECTION = '@Jsonapi:RECEIVED_PREV_COLLECTION',
