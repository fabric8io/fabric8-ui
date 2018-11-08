global.CSS = null;
global.ENV = 'test';

const mock = () => {
  let storage = {};
  return {
    getItem: (key) => (key in storage ? storage[key] : null),
    setItem: (key, value) => {
      storage[key] = value || '';
    },
    removeItem: (key) => delete storage[key],
    clear: () => {
      storage = {};
      return storage;
    },
  };
};

Object.defineProperty(window, 'localStorage', { value: mock() });
Object.defineProperty(window, 'sessionStorage', { value: mock() });
window.open = jest.fn();
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance'],
    getPropertyValue: () => '',
  }),
});
document.execCommand = () => true;

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});

function warnSpyApi(name) {
  console.warn(`Using API '${name}' is non-standard jest. Update test to use 'jest.spyOn' API.`);
}

// helper to migrate from jasmine to jest
const spyOnShim = (object, method, accessType) => {
  const spy = jest.spyOn(object, method, accessType);
  if (!spy.and) {
    spy.and = {
      returnValue(value) {
        warnSpyApi('Spy#returnValue');
        spy.mockReturnValue(value);
        return spy;
      },
      callThrough() {
        warnSpyApi('Spy#callThrough');
        return spy;
      },
      throwError(value) {
        spy.mockImplementation(() => {
          warnSpyApi('Spy#mockImplementation');
          throw new Error(value);
        });
        return spy;
      },
      callFake(fn) {
        warnSpyApi('Spy#callFake');
        spy.mockImplementation(fn);
        return spy;
      },
    };
  }
  return spy;
};

global.spyOnProperty = (...args) => {
  warnSpyApi('spyOnProperty');
  return spyOnShim.call(this, ...args);
};

global.spyOn = spyOnShim;
