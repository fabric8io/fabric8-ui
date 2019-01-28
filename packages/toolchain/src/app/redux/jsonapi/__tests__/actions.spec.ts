import { mockStore, getAction } from '../../../../test/mockRedux';
import * as actions from '../actions';
import { JsonapiActionTypes } from '../actionTypes';
import { DataDocument, ErrorObject, JsonApiError } from '../../../api/models/jsonapi';

describe('localStorage actions', () => {
  it('should create request entity action', () => {
    expect(actions.requestEntity('foo', 'bar')).toEqual({
      type: JsonapiActionTypes.REQUEST_ENTITY,
      payload: {
        type: 'foo',
        id: 'bar',
      },
    });
  });

  it('should create receive entity action', () => {
    const dataDocument = {} as DataDocument;
    const receivedAt = Date.now();
    expect(actions.receivedEntity('foo', 'bar', dataDocument, receivedAt)).toEqual({
      type: JsonapiActionTypes.RECEIVED_ENTITY,
      payload: {
        type: 'foo',
        id: 'bar',
        dataDocument,
        receivedAt,
      },
    });

    // TODO test without passing in receivedAt
  });

  it('should received entity error action', () => {
    const error = {} as ErrorObject;
    const receivedAt = Date.now();
    expect(actions.receivedEntityError('foo', 'bar', error, receivedAt)).toEqual({
      type: JsonapiActionTypes.RECEIVED_ENTITY_ERROR,
      payload: {
        type: 'foo',
        id: 'bar',
        error,
        receivedAt,
      },
    });
    // TODO test without passing in receivedAt
  });

  it('should create invalidate entity action', () => {
    expect(actions.invalidateEntity('foo', 'bar')).toEqual({
      type: JsonapiActionTypes.INVALIDATE_ENTITY,
      payload: {
        type: 'foo',
        id: 'bar',
      },
    });
  });

  it('should create request collection action', () => {
    expect(actions.requestCollection('/foo/bar')).toEqual({
      type: JsonapiActionTypes.REQUEST_COLLECTION,
      payload: {
        url: '/foo/bar',
      },
    });
  });

  it('should create received collection action', () => {
    const dataDocument = {} as DataDocument;
    const receivedAt = Date.now();
    expect(actions.receivedCollection('/foo/bar', dataDocument, receivedAt)).toEqual({
      type: JsonapiActionTypes.RECEIVED_COLLECTION,
      payload: {
        url: '/foo/bar',
        dataDocument,
        receivedAt,
      },
    });
    // TODO test without passing in receivedAt
  });

  it('should received collection error action', () => {
    const error = {} as ErrorObject;
    const receivedAt = Date.now();
    expect(actions.receivedCollectionError('/foo/bar', error, receivedAt)).toEqual({
      type: JsonapiActionTypes.RECEIVED_COLLECTION_ERROR,
      payload: {
        url: '/foo/bar',
        error,
        receivedAt,
      },
    });
    // TODO test without passing in receivedAt
  });

  it('should create invalidate collection action', () => {
    expect(actions.invalidateCollection('/foo/bar')).toEqual({
      type: JsonapiActionTypes.INVALIDATE_COLLECTION,
      payload: {
        url: '/foo/bar',
      },
    });
  });

  it('should create request next collection action', () => {
    expect(actions.requestNextCollection('/foo/bar')).toEqual({
      type: JsonapiActionTypes.REQUEST_NEXT_COLLECTION,
      payload: {
        url: '/foo/bar',
      },
    });
  });

  it('should create received next collection action', () => {
    const dataDocument = {} as DataDocument;
    const receivedAt = Date.now();
    expect(actions.receivedNextCollection('/foo/bar', dataDocument, receivedAt)).toEqual({
      type: JsonapiActionTypes.RECEIVED_NEXT_COLLECTION,
      payload: {
        url: '/foo/bar',
        dataDocument,
        receivedAt,
      },
    });
    // TODO test without passing in receivedAt
  });

  it('should handle fetch valid entity', async () => {
    const store = mockStore({
      jsonapi: {
        entities: {},
        collections: {},
      },
    });
    store.dispatch(actions.fetchEntity('spaces', 'space-id'));
    expect(await getAction(store, JsonapiActionTypes.REQUEST_ENTITY)).toEqual({
      type: JsonapiActionTypes.REQUEST_ENTITY,
      payload: {
        type: 'spaces',
        id: 'space-id',
      },
    });
    // TODO complete test
  });

  // TODO complete tests
});
