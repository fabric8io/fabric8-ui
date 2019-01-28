import * as actions from '../actions';
import { RedirectActionTypes } from '../actionTypes';

describe('redirect actions', () => {
  it('should create redirect action', () => {
    expect(actions.redirect('http://example/url')).toEqual({
      type: RedirectActionTypes.REDIRECT,
      payload: {
        url: 'http://example/url',
      },
    });
  });
});
