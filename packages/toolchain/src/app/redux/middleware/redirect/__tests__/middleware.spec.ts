import { redirectMiddleware } from '../middleware';
import { redirect } from '../actions';
import { mockLocation } from '../../../../../test/mockBrowser';

describe('redirect middleware', () => {
  it('should call next', () => {
    const next = jest.fn();
    redirectMiddleware()(next)({} as any);
    expect(next).toHaveBeenCalled();
  });

  it('should handle REDIRECT', () => {
    mockLocation();
    redirectMiddleware()(() => {})(redirect('http://example'));
    expect(window.location.href).toBe('http://example');
  });
});
