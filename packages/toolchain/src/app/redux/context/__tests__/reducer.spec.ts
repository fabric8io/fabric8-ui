import { LOCATION_CHANGE, LocationChangeAction } from 'connected-react-router';
import { contextReducer } from '../reducer';
import { ContextState } from '../state';
import { NO_SPACE_PATH } from '../constants';

function expectContext(pathname: string, expected: ContextState) {
  const state = {} as any;
  expect(
    contextReducer(state, {
      type: LOCATION_CHANGE,
      payload: {
        action: 'PUSH',
        location: {
          hash: '',
          search: '',
          state: '',
          pathname,
        },
      },
    }),
  ).toEqual(expected);
}

describe('context reducer', () => {
  it('should return initial state', () => {
    expect(contextReducer(undefined, {} as any)).toEqual({
      spacenamePath: NO_SPACE_PATH,
      subPath: '',
    } as ContextState);
  });

  it('should passthrough unhandled action', () => {
    const state = {} as any;
    expect(contextReducer(state, {} as any)).toBe(state);
  });

  it('should handle pathname /username/spacename', () => {
    expectContext('/john/tutorial', {
      spacename: 'tutorial',
      spacenamePath: 'tutorial',
      subPath: undefined,
      username: 'john',
    });
  });

  it('should handle pathname /username/spacename/sub/path', () => {
    expectContext('/john/tutorial/sub/path', {
      spacename: 'tutorial',
      spacenamePath: 'tutorial',
      subPath: '/sub/path',
      username: 'john',
    });
  });

  it('should handle pathname /username/_segment', () => {
    expectContext('/john/_home', {
      spacename: undefined,
      spacenamePath: '_landing',
      subPath: '/_home',
      username: 'john',
    });
  });

  it('should handle pathname /username/_landing/sub/path', () => {
    expectContext('/john/_landing/sub/path', {
      spacename: undefined,
      spacenamePath: '_landing',
      subPath: '/sub/path',
      username: 'john',
    });
  });

  it('should handle pathname /username', () => {
    expectContext('/john', {
      spacename: undefined,
      spacenamePath: '_landing',
      subPath: undefined,
      username: 'john',
    });
  });

  it('should handle pathname /_segment', () => {
    expectContext('/_home', {
      spacename: undefined,
      spacenamePath: '_landing',
      // TODO this cannot be right!? should be `undefined`, no?
      subPath: '/_home',
      username: undefined,
    });
  });

  it('should handle pathname /', () => {
    expectContext('/', {
      spacename: undefined,
      spacenamePath: '_landing',
      subPath: '/',
      username: undefined,
    });
  });
});
