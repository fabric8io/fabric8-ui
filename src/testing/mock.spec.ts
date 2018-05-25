import { Type } from '@angular/core';

import { createMock } from './mock';

class TestClass {
  foo(): string {
    return 'bar';
  }

  prop: string = 'unmocked';
}

describe('createMock', (): void => {
  it('should mock class functions', (): void => {
    const mock: jasmine.SpyObj<TestClass> = createMock(TestClass);
    expect(mock.foo).toBeDefined();
    expect(typeof mock.foo).toBe('function');
  });

  it('should throw an "unimplemented" error on mocked functions by default', (): void => {
    const mock: jasmine.SpyObj<TestClass> = createMock(TestClass);
    try {
      mock.foo();
    } catch (e) {
      expect(e).toEqual(new Error('TestClass#foo not implemented'));
      return;
    }
    fail();
  });

  it('should not mock class properties', (): void => {
    const mock: jasmine.SpyObj<TestClass> = createMock(TestClass);
    expect(mock.prop).toBeUndefined();
  });

  describe('falsy inputs', (): void => {
    [undefined, null].forEach((value: Type<TestClass>): void => {
      it(`should fail gracefully on ${value}`, (): void => {
        try {
          createMock(value);
        } catch (e) {
          expect(e).toEqual(new Error(`Cannot mock falsy value "${value}"`));
          return;
        }
        fail();
      });
    });
  });
});
