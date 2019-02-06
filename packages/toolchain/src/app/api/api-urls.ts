import { AUTH_API_URL, FEATURE_TOGGLES_API_URL, WIT_API_URL } from './internal/api.config';

export const getLogoutUrl = (redirect: string) =>
  `${AUTH_API_URL}logout/v2${redirect ? `?redirect=${encodeURIComponent(redirect)}` : ''}`;
export const getLoginAuthorizeUrl = () => `${WIT_API_URL}login/authorize`;
export const getCurrentUserSpacesUrl = () => `${WIT_API_URL}user/spaces`;
export const getCurrentUserUrl = () => `${AUTH_API_URL}user`;
export const getFeaturesUrl = () => `${FEATURE_TOGGLES_API_URL}features?strategy=enableByLevel`;
export const getSpaceByIdUrl = (id: string) => `${WIT_API_URL}spaces/${id}`;
export const getUserByIdUrl = (id: string) => `${AUTH_API_URL}users/${id}`;
export const getNamedSpacesUrl = (username: string) => `${WIT_API_URL}namedspaces/${username}`;

export const getEntityUrl = (type: string, id: string) => {
  switch (type) {
    case 'identities':
      return getUserByIdUrl(id);
    case 'spaces':
      return getSpaceByIdUrl(id);
    default:
      throw new Error(`Url requested for unsupported entity type '${type}'.`);
  }
};
