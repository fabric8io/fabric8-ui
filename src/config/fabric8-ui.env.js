window.Fabric8UIEnv = {
  "kubernetesMode": "{{ .Env.KUBERNETES_MODE }}",
  "analyticsWriteKey": "{{ .Env.ANALYTICS_WRITE_KEY }}",
  "branding": "{{ .Env.BRANDING }}",
  "forgeApiUrl": "{{ .Env.FABRIC8_FORGE_API_URL }}",
  "openshiftConsoleUrl": "{{ .Env.OPENSHIFT_CONSOLE_URL }}",
  "openshiftProxiedApiServer": "{{ .Env.PROXIED_K8S_API_SERVER }}",
  "pipelinesNamespace": "{{ .Env.FABRIC8_PIPELINES_NAMESPACE }}",
  "recommenderApiUrl": "{{ .Env.FABRIC8_RECOMMENDER_API_URL }}",
  "ssoApiUrl": "{{ .Env.FABRIC8_SSO_API_URL }}",
  "statusApiUrl": "{{ .Env.FABRIC8_STATUS_API_URL }}",
  "witApiUrl": "{{ .Env.FABRIC8_WIT_API_URL }}"
};
