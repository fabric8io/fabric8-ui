const { FABRIC8_AUTH_API_URL, FABRIC8_FEATURE_TOGGLES_API_URL, FABRIC8_WIT_API_URL } = process.env;

const config: { [key: string]: string } = (window as any).Fabric8UIEnv || {};
export const AUTH_API_URL = config.authApiUrl || FABRIC8_AUTH_API_URL;
export const FEATURE_TOGGLES_API_URL =
  config.featureTogglesApiUrl || FABRIC8_FEATURE_TOGGLES_API_URL;
export const WIT_API_URL = config.witApiUrl || FABRIC8_WIT_API_URL;
