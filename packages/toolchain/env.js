function getProductionEnv() {
  const {
    FABRIC8_FORGE_API_URL,
    FABRIC8_FEATURE_TOGGLES_API_URL,
    FABRIC8_WIT_API_URL,
    FABRIC8_REALM,
    FABRIC8_SSO_API_URL,
    FABRIC8_AUTH_API_URL,
    FABRIC8_RECOMMENDER_API_URL = 'http://api-bayesian.dev.rdu2c.fabric8.io/api/v1/',
    FORGE_URL: FABRIC8_FORGE_URL,
    FABRIC8_PIPELINES_NAMESPACE,
    FABRIC8_JENKINS_API_URL,
    BUILD_NUMBER,
    BUILD_TIMESTAMP,
    BUILD_VERSION,
    FABRIC8_BRANDING = 'fabric8',
    ANALYTICS_RECOMMENDER_URL,
    ANALYTICS_LICENSE_URL,
    FABRIC8_BUILD_TOOL_DETECTOR_API_URL,
  } = process.env;

  return {
    FABRIC8_FORGE_API_URL,
    FABRIC8_FEATURE_TOGGLES_API_URL,
    FABRIC8_WIT_API_URL,
    FABRIC8_REALM,
    FABRIC8_SSO_API_URL,
    FABRIC8_AUTH_API_URL,
    FABRIC8_RECOMMENDER_API_URL,
    FABRIC8_FORGE_URL,
    FABRIC8_PIPELINES_NAMESPACE,
    FABRIC8_JENKINS_API_URL,
    BUILD_NUMBER,
    BUILD_TIMESTAMP,
    BUILD_VERSION,
    FABRIC8_BRANDING,
    ANALYTICS_RECOMMENDER_URL,
    ANALYTICS_LICENSE_URL,
    FABRIC8_BUILD_TOOL_DETECTOR_API_URL,
  };
}

function getDevelopmentEnv() {
  const {
    FABRIC8_FORGE_API_URL = 'https://forge.api.prod-preview.openshift.io',
    FABRIC8_WIT_API_URL = 'https://prod-preview.openshift.io/api/',
    FABRIC8_FEATURE_TOGGLES_API_URL = FABRIC8_WIT_API_URL,
    FABRIC8_REALM,
    FABRIC8_SSO_API_URL = 'https://sso.prod-preview.openshift.io/',
    FABRIC8_AUTH_API_URL = 'https://auth.prod-preview.openshift.io/api/',
    FABRIC8_RECOMMENDER_API_URL = 'https://api-bayesian.dev.rdu2c.fabric8.io/api/v1/',
    FORGE_URL: FABRIC8_FORGE_URL,
    FABRIC8_PIPELINES_NAMESPACE,
    FABRIC8_JENKINS_API_URL,
    BUILD_NUMBER,
    BUILD_TIMESTAMP,
    BUILD_VERSION,
    FABRIC8_BRANDING = 'fabric8',
    ANALYTICS_RECOMMENDER_URL,
    ANALYTICS_LICENSE_URL,
    FABRIC8_BUILD_TOOL_DETECTOR_API_URL = 'https://detector.api.prod-preview.openshift.io',
  } = process.env;

  return {
    FABRIC8_FORGE_API_URL,
    FABRIC8_FEATURE_TOGGLES_API_URL,
    FABRIC8_WIT_API_URL,
    FABRIC8_REALM,
    FABRIC8_SSO_API_URL,
    FABRIC8_AUTH_API_URL,
    FABRIC8_RECOMMENDER_API_URL,
    FABRIC8_FORGE_URL,
    FABRIC8_PIPELINES_NAMESPACE,
    FABRIC8_JENKINS_API_URL,
    BUILD_NUMBER,
    BUILD_TIMESTAMP,
    BUILD_VERSION,
    FABRIC8_BRANDING,
    ANALYTICS_RECOMMENDER_URL,
    ANALYTICS_LICENSE_URL,
    FABRIC8_BUILD_TOOL_DETECTOR_API_URL,
  };
}

module.exports = () =>
  process.env.NODE_ENV === 'production' ? getProductionEnv() : getDevelopmentEnv();
