import { Type } from '@angular/core';

import { uniq } from 'lodash';

/*
 * Pass in an ES6 Class and this function returns back an instance of that class
 * where all of the functions are spies that throw "Not Implemented" errors by default.
 * Non-function properties, including getters and setters of properties, will not be
 * mocked.
 *
 * Note: must be called from within a jasmine context, ie "before*"" or "it" block
 */
export function createMock<T extends Object>(type: Type<T>): jasmine.SpyObj<T> {
  if (!type) {
    throw new Error(`Cannot mock falsy value "${type}"`);
  }
  const methodNames: string[] = uniq(getClassMethods(type.prototype));
  const mock: jasmine.SpyObj<T> = jasmine.createSpyObj<T>(type.name, methodNames);
  methodNames.forEach((mtd: string): void => mock[mtd].and.throwError(`${type.name}#${mtd} not implemented`));
  return mock;
}

function getClassMethods(klazz: Object): string[] {
  if (!klazz) {
    return [];
  }
  return getOwnMethods(klazz).concat(getClassMethods(Object.getPrototypeOf(klazz)));
}

function getOwnMethods(klazz: Object): string[] {
  if (!klazz || klazz === Object.prototype) {
    return [];
  }
  return Object.getOwnPropertyNames(klazz)
    .filter((prop: string): boolean => klazz[prop] instanceof Function);
}
