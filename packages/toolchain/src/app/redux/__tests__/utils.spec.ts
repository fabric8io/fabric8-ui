import { createAction } from '../utils';

describe('utils', () => {
  it('should create action', () => {
    expect(createAction('foo')).toEqual({ type: 'foo' });
    expect(createAction('foo', { a: 'a', b: 'b' })).toEqual({
      type: 'foo',
      payload: { a: 'a', b: 'b' },
    });
  });

  it('should create development action', () => {
    process.env.NODE_ENV = 'development';
    const action = createAction('foo') as any;
    // development actions are frozen and cannot be modified
    expect(() => (action.payload = {})).toThrowError();
  });

  it('should create production action', () => {
    process.env.NODE_ENV = 'production';
    const action = createAction('foo') as any;
    // production actions are not frozen and can be modified
    expect(() => (action.payload = {})).not.toThrowError();
  });
});
