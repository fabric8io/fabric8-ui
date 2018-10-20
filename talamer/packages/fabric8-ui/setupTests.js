(function() {
  const jasmineCore = require("jasmine-core");

  const jasmine = jasmineCore.core(jasmineCore);

  const env = jasmine.getEnv({ suppressLoadErrors: true });

  jasmineCore.interface(jasmine, env);

  global["jasmine"] = jasmine;
})();

// a very crude hack to allow c3 tests to function
jest.mock("c3", function createProxy() {
  return new Proxy(
    {},
    {
      get: () => () => createProxy(),
      set: () => true
    }
  );
});

require("@osio/scripts/config/jest/setup.angular");
