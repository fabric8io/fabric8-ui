const { FABRIC8_AUTH_API_URL, FABRIC8_WIT_API_URL } = process.env;

const DEFAULT_URL = '/api/';
const config: { [key: string]: string } = (window as any).Fabric8UIEnv || {};
export const AUTH_API_URL = config.authApiUrl || FABRIC8_AUTH_API_URL || DEFAULT_URL;
export const WIT_API_URL = config.witApiUrl || FABRIC8_WIT_API_URL || DEFAULT_URL;
export const FEATURE_TOGGLES_API_URL = WIT_API_URL;
