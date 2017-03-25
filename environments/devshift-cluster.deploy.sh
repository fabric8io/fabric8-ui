#!/usr/bin/env bash

export KUBERNETES_SERVICE_HOST=tsrv.devshift.net
export KUBERNETES_SERVICE_PORT=8443

echo "Using Kubernetes Master: ${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"

[ -z "$KUBERNETES_SERVICE_HOST" ] && IFS=':' read KUBERNETES_SERVICE_HOST KUBERNETES_SERVICE_PORT <<< "$PARTS"
[ -z "$KUBERNETES_SERVICE_HOST" ] && echo "Need to set KUBERNETES_SERVICE_HOST" && exit 1;
[ -z "$KUBERNETES_SERVICE_PORT" ] && echo "Need to set KUBERNETES_SERVICE_PORT" && exit 1;


export OAUTH_AUTHORIZE_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/oauth/authorize"
export OAUTH_LOGOUT_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/connect/endsession?id_token={{id_token}}"
# This is devshift
export PROXIED_K8S_API_SERVER="${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"

# This is our proxy that we will connect to
#export K8S_API_SERVER="" # Intentionally left blank, we want to use the support for detecting the URL

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
  export K8S_API_SERVER_PROTOCOL="http"
fi
if [ -z "${K8S_API_SERVER_BASE_PATH}" ]; then
  export K8S_API_SERVER_BASE_PATH="/_p/oso"
fi
if [ -z "${WS_K8S_API_SERVER}" ]; then
  export WS_K8S_API_SERVER=${PROXIED_K8S_API_SERVER}
fi

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
echo ""

echo "Now run:"
echo ""
echo "   docker run -e WS_K8S_API_SERVER -e K8S_API_SERVER_PROTOCOL -e K8S_API_SERVER_BASE_PATH -e OAUTH_ISSUER -e OAUTH_CLIENT_ID -e OAUTH_SCOPE -e OAUTH_AUTHORIZE_URI -e OAUTH_LOGOUT_URI -p 8080:8080 fabric8-ui-deploy"
echo ""
