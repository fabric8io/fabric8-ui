global['CSS'] = null;

const mock = () => {
  let storage = {};
  return {
    getItem: (key: string) => key in storage ? storage[key] : null,
    setItem: (key: string, value: any) => storage[key] = value || '',
    removeItem: (key: string) => delete storage[key],
    clear: () => storage = {}
  };
};

Object.defineProperty(window, 'localStorage', {value: mock()});
Object.defineProperty(window, 'sessionStorage', {value: mock()});
Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>'
});
Object.defineProperty(window, 'getComputedStyle', {
  value: () => {
    return {
      display: 'none',
      appearance: ['-webkit-appearance'],
      getPropertyValue() {
        return '';
      }
    };
  }
});
document['execCommand'] = () => true;

/**
 * ISSUE: https://github.com/angular/material2/issues/7101
 * Workaround for JSDOM missing transform property
 */
Object.defineProperty(document.body.style, 'transform', {
  value: () => {
    return {
      enumerable: true,
      configurable: true
    };
  }
});

// a very crude hack to allow c3 tests to function
function createProxy() {
  return new Proxy({}, {
    get() {
      return () => createProxy();
    },
    set() {
      return true;
    }
  });
}
jest.mock('c3', createProxy);
// jest.mock('d3', createProxy);

// helper to migrate from jasmine to jest
global['spyOnProperty'] = (object, method, accessType) => {
  const spy = jest.spyOn(object, method, accessType);
  if (!spy['and']) {
    spy['and'] = {
      returnValue(value: any) {
        spy.mockReturnValue(value);
        return spy;
      },
      callThrough() {
        return spy;
      },
      throwError(value) {
        spy.mockImplementation(() => {
          throw new Error(value);
        });
        return spy;
      },
      callFake(fn) {
        spy.mockImplementation(fn);
        return spy;
      }
    };
  }
  return spy;
};

global['spyOn'] = global['spyOnProperty'];
