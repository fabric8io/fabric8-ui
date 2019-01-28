import * as actions from '../actions';
import { LocalStorageActionTypes } from '../actionTypes';

describe('localStorage actions', () => {
  it('should create set item action', () => {
    expect(actions.setLocalStorageItem('foo', 'bar')).toEqual({
      type: LocalStorageActionTypes.SET_ITEM,
      payload: {
        key: 'foo',
        value: 'bar',
      },
    });
  });

  it('should create remove item action', () => {
    expect(actions.removeLocalStorageItem('foo')).toEqual({
      type: LocalStorageActionTypes.REMOVE_ITEM,
      payload: {
        key: 'foo',
      },
    });
  });
});
