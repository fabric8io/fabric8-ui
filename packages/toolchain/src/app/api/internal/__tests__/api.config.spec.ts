describe('api.config', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should fallback to api URLs from process.env', () => {
    const bak = process.env;
    process.env.FABRIC8_AUTH_API_URL = 'test-auth-url';
    process.env.FABRIC8_FEATURE_TOGGLES_API_URL = 'test-ft-url';
    process.env.FABRIC8_WIT_API_URL = 'test-wit-url';

    // eslint-disable-next-line
    const config = require('../api.config');
    expect(config.AUTH_API_URL).toBe('test-auth-url');
    expect(config.FEATURE_TOGGLES_API_URL).toBe('test-ft-url');
    expect(config.WIT_API_URL).toBe('test-wit-url');

    process.env = bak;
  });

  it('should get api URLs from Fabric8UIEnv', () => {
    const bak = (window as any).Fabric8UIEnv;
    (window as any).Fabric8UIEnv = {
      authApiUrl: 'test-auth-url',
      witApiUrl: 'test-wit-url',
      featureTogglesApiUrl: 'test-ft-url',
    };

    // eslint-disable-next-line
    const config = require('../api.config');
    expect(config.AUTH_API_URL).toBe('test-auth-url');
    expect(config.FEATURE_TOGGLES_API_URL).toBe('test-ft-url');
    expect(config.WIT_API_URL).toBe('test-wit-url');

    (window as any).Fabric8UIEnv = bak;
  });
});
