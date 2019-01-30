import { localStorageMiddleware } from '../middleware';
import { mockLocalStorage } from '../../../../../test/mockBrowser';
import { setLocalStorageItem, removeLocalStorageItem } from '../actions';

describe('localStorage middleware', () => {
  it('should call next', () => {
    const next = jest.fn();
    localStorageMiddleware()(next)({} as any);
    expect(next).toHaveBeenCalled();
  });

  it('should handle SET_ITEM', () => {
    mockLocalStorage();
    localStorageMiddleware()(() => {})(setLocalStorageItem('foo', 'bar'));
    expect(localStorage.setItem).toHaveBeenCalledWith('foo', 'bar');
  });

  it('should handle REMOVE_ITEM', () => {
    mockLocalStorage();
    localStorageMiddleware()(() => {})(removeLocalStorageItem('foo'));
    expect(localStorage.removeItem).toHaveBeenCalledWith('foo');
  });
});
