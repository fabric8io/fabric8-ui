#!/usr/bin/env bash

export KUBERNETES_SERVICE_HOST=""
export KUBERNETES_SERVICE_PORT=""

# to disable ANSI color output
export TERM=dumb

export VM_IP=$(minikube ip)


export KUBERNETES_SERVICE_HOST=${VM_IP}
export KUBERNETES_SERVICE_PORT=8443

echo "Using Kubernetes Master: ${KUBERNETES_SERVICE_HOST}:${KUBERNETES_SERVICE_PORT}"


export OAUTH_AUTHORIZE_URI=""
export OAUTH_LOGOUT_URI=""


export K8S_API_SERVER="localhost:3000"
export PROXIED_K8S_API_SERVER="localhost:3000"
#export WS_K8S_API_SERVER=${PROXIED_K8S_API_SERVER}
export WS_K8S_API_SERVER="localhost:3000"

export K8S_API_SERVER_BASE_PATH="/_p/oso"
export WS_K8S_API_SERVER_BASE_PATH="/_p/oso"
export K8S_API_SERVER_PROTOCOL="http"

export OAUTH_ISSUER=""
export OAUTH_SCOPE="user:full"
export OAUTH_CLIENT_ID="fabric8"
export FABRIC8_PIPELINES_NAMESPACE=""
export FABRIC8_REALM="fabric8"

export NAMESPACE=`oc project -q`

export KUBERNETES_MODE=true

echo "Configured to connect to kubernetes cluster at https://${PROXIED_K8S_API_SERVER}/ with namespace ${NAMESPACE}"

export FABRIC8_SSO_API_URL="http://sso.fabric8.${VM_IP}.nip.io/"
export FABRIC8_WIT_API_URL="http://wit.fabric8.${VM_IP}.nip.io/api/"
export FABRIC8_FORGE_API_URL="http://forge.fabric8.${VM_IP}.nip.io//"


echo ""
echo "WS_K8S_API_SERVER:             ${WS_K8S_API_SERVER}"
echo "WS_K8S_API_SERVER_BASE_PATH:   ${WS_K8S_API_SERVER_BASE_PATH}"
echo ""
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
echo "FABRIC8_FORGE_API_URL          ${FABRIC8_FORGE_API_URL}"
echo "FABRIC8_REALM                  ${FABRIC8_REALM}"
echo ""
