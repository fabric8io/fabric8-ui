import * as urls from '../api-urls';

jest.mock('../internal/api.config.ts');

describe('api.urls', () => {
  it('should get logout url', () => {
    expect(urls.getLogoutUrl('')).toBe('/auth-api-url/logout/v2');
    expect(urls.getLogoutUrl('foobar')).toBe('/auth-api-url/logout/v2?redirect=foobar');
    expect(urls.getLogoutUrl('foo&bar')).toBe('/auth-api-url/logout/v2?redirect=foo%26bar');
  });

  it('should get login authorize url', () => {
    expect(urls.getLoginAuthorizeUrl()).toBe('/wit-api-url/login/authorize');
  });

  it('should get current user spaces url', () => {
    expect(urls.getCurrentUserSpacesUrl()).toBe('/wit-api-url/user/spaces');
  });

  it('should get current user url', () => {
    expect(urls.getCurrentUserUrl()).toBe('/auth-api-url/user');
  });

  it('should get features url', () => {
    expect(urls.getFeaturesUrl()).toBe('/feature-toggles-api-url/features?strategy=enableByLevel');
  });

  it('should get space by id url', () => {
    expect(urls.getSpaceByIdUrl('foobar')).toBe('/wit-api-url/spaces/foobar');
  });

  it('should get user by id url', () => {
    expect(urls.getUserByIdUrl('foobar')).toBe('/auth-api-url/users/foobar');
  });

  it('should get named spaces url', () => {
    expect(urls.getNamedSpacesUrl('foobar')).toBe('/wit-api-url/namedspaces/foobar');
  });

  it('should get entity url', () => {
    expect(() => urls.getEntityUrl('unknown', 'unknown')).toThrowError(
      `Url requested for unsupported entity type 'unknown'.`,
    );
    expect(urls.getEntityUrl('identities', 'foo')).toBe('/auth-api-url/users/foo');
    expect(urls.getEntityUrl('spaces', 'foo')).toBe('/wit-api-url/spaces/foo');
  });
});
