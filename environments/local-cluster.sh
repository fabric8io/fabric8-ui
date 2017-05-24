#!/usr/bin/env bash

export KUBERNETES_SERVICE_HOST=""
export KUBERNETES_SERVICE_PORT=""

# to disable ANSI color output
export TERM=dumb


PARTS=$(kubectl cluster-info | grep master |sed -e 's/.*http:\/\///g' -e 's/.*https:\/\///g')

[ -z "$KUBERNETES_SERVICE_HOST" ] && IFS=':' read KUBERNETES_SERVICE_HOST KUBERNETES_SERVICE_PORT <<< "$PARTS"
[ -z "$KUBERNETES_SERVICE_HOST" ] && echo "Need to set KUBERNETES_SERVICE_HOST" && exit 1;
[ -z "$KUBERNETES_SERVICE_PORT" ] && echo "Need to set KUBERNETES_SERVICE_PORT" && exit 1;

echo "Using Kubernetes Master: ${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"


export OAUTH_AUTHORIZE_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/oauth/authorize"
export OAUTH_LOGOUT_URI="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}/connect/endsession?id_token={{id_token}}"
# This is devshift
export PROXIED_K8S_API_SERVER="${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"
# This is our proxy that we will connect to
export K8S_API_SERVER="localhost:3000"

export OAUTH_ISSUER="https://${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"
export OAUTH_SCOPE="user:full"
export OAUTH_CLIENT_ID="fabric8"
export K8S_API_SERVER_PROTOCOL="http"
export K8S_API_SERVER_BASE_PATH="/_p/oso"
export WS_K8S_API_SERVER=${PROXIED_K8S_API_SERVER}
export FABRIC8_PIPELINES_NAMESPACE="-development"
export FABRIC8_REALM="fabric8"

export NAMESPACE=`oc project -q`

echo "Configured to connect to kubernetes cluster at https://${PROXIED_K8S_API_SERVER}/ with namespace ${NAMESPACE}"

export FABRIC8_SSO_API_URL=`minishift openshift service keycloak -n ${NAMESPACE} --url`
export FABRIC8_WIT_API_URL="`minishift openshift service wit -n ${NAMESPACE} --url`/api/"
export FABRIC8_FORGE_API_URL=`minishift openshift service forge -n ${NAMESPACE} --url`

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
echo "FABRIC8_SSO_API_URL            ${FABRIC8_SSO_API_URL}"
echo "FABRIC8_WIT_API_URL            ${FABRIC8_WIT_API_URL}"
echo "FABRIC8_REALM                  ${FABRIC8_REALM}"
echo "FABRIC8_FORGE_API_URL          ${FABRIC8_FORGE_API_URL}"
echo ""
