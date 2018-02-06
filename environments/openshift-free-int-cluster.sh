#!/usr/bin/env bash

export KUBERNETES_SERVICE_HOST=f8osoproxy-test-dsaas-preview.b6ff.rh-idev.openshiftapps.com
export KUBERNETES_SERVICE_PORT=443
export OPENSHIFT_CONSOLE_HOST=console.free-stg.openshift.com
export OPENSHIFT_CONSOLE_PORT=443

echo "Using Kubernetes Master: ${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"

[ -z "$KUBERNETES_SERVICE_HOST" ] && IFS=':' read KUBERNETES_SERVICE_HOST KUBERNETES_SERVICE_PORT <<< "$PARTS"
[ -z "$KUBERNETES_SERVICE_HOST" ] && echo "Need to set KUBERNETES_SERVICE_HOST" && exit 1;
[ -z "$KUBERNETES_SERVICE_PORT" ] && echo "Need to set KUBERNETES_SERVICE_PORT" && exit 1;


export OAUTH_AUTHORIZE_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/oauth/authorize"
export OAUTH_LOGOUT_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/connect/endsession?id_token={{id_token}}"
# This is devshift
export PROXIED_K8S_API_SERVER="${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"
# This is our proxy that we will connect to
export K8S_API_SERVER="localhost:3000"

export OPENSHIFT_CONSOLE_URL="https://${OPENSHIFT_CONSOLE_HOST}:${OPENSHIFT_CONSOLE_PORT}/console"

if [ -z "${OAUTH_ISSUER}" ]; then
  export OAUTH_ISSUER="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"
fi
if [ -z "${OAUTH_SCOPE}" ]; then
  export OAUTH_SCOPE="user:full"
fi
if [ -z "${OAUTH_CLIENT_ID}" ]; then
  export OAUTH_CLIENT_ID="fabric8"
fi
if [ -z "${K8S_API_SERVER_PROTOCOL}" ]; then
  export K8S_API_SERVER_PROTOCOL="https"
fi
if [ -z "${K8S_API_SERVER_BASE_PATH}" ]; then
  export K8S_API_SERVER_BASE_PATH=""
fi
if [ -z "${WS_K8S_API_SERVER}" ]; then
  export WS_K8S_API_SERVER=${PROXIED_K8S_API_SERVER}
fi
if [ -z "${FABRIC8_PIPELINES_NAMESPACE}" ]; then
  export FABRIC8_PIPELINES_NAMESPACE=""
fi

# this URL is used in dev mode only, for now feature-toggles.service.ts used WIT url as a proxy
#export FABRIC8_FEATURE_TOGGLES_API_URL=http://localhost:8080/api/
export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
export FABRIC8_FEATURE_TOGGLES_API_URL=${FABRIC8_WIT_API_URL}

echo "Configured to connect to kubernetes cluster at https://${PROXIED_K8S_API_SERVER}/"

echo ""
echo "WS_K8S_API_SERVER:             ${WS_K8S_API_SERVER}"
echo "K8S_API_SERVER_PROTOCOL:       ${K8S_API_SERVER_PROTOCOL}"
echo "K8S_API_SERVER_BASE_PATH:      ${K8S_API_SERVER_BASE_PATH}"
echo "OAUTH_ISSUER:                  ${OAUTH_ISSUER}"
echo "OAUTH_CLIENT_ID:               ${OAUTH_CLIENT_ID}"
echo "OAUTH_SCOPE:                   ${OAUTH_SCOPE}"
echo "OAUTH_AUTHORIZE_URI            ${OAUTH_AUTHORIZE_URI}"
echo "OAUTH_LOGOUT_URI               ${OAUTH_LOGOUT_URI}"
echo "FABRIC8_PIPELINES_NAMESPACE    ${FABRIC8_PIPELINES_NAMESPACE}"
echo "OPENSHIFT_CONSOLE_URL          ${OPENSHIFT_CONSOLE_URL}"
# echo "FABRIC8_FEATURE_TOGGLES_API_URL          ${FABRIC8_FEATURE_TOGGLES_API_URL}"
echo ""
