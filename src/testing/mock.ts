import { Type } from '@angular/core';

import { uniq } from 'lodash';

/*
 * Pass in an ES6 Class and this function returns back an instance of that class
 * where all of the functions are spies that throw "Not Implemented" errors by default.
 *
 * Note: must be called from within a jasmine before* or it block
 */
export function createMock<T extends Object>(type: Type<T>): jasmine.SpyObj<T> {
  if (!type) {
    throw new Error(`Cannot mock falsy value "${type}"`);
  }
  const methodNames = uniq(getClassMethods(type.prototype));
  const mock = jasmine.createSpyObj<T>(type.name, methodNames);
  methodNames.forEach(mtd => mock[mtd].and.throwError(`${type.name}#${mtd} not implemented`));
  return mock;
}

function getClassMethods(type: Object): Array<string> {
  if (!type) {
    return [];
  }
  return getOwnMethods(type).concat(getClassMethods(Object.getPrototypeOf(type)));
}

function getOwnMethods(type: Object): Array<string> {
  if (!type || type === Object.prototype) {
    return [];
  }
  return Object.getOwnPropertyNames(type)
    .filter(prop => type[prop] instanceof Function);
}
