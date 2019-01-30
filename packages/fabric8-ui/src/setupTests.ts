require('@talamer/scripts/config/jest/jasmine.shim');

// a very crude hack to allow c3 tests to function
jest.mock('c3', function createProxy() {
  return new Proxy(
    {},
    {
      get: () => () => createProxy(),
      set: () => true,
    },
  );
});

require('@talamer/scripts/config/jest/setup.angular');
