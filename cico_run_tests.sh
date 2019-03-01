#!/bin/bash

APP_DIR="packages/toolchain"

# Exit on error
set -e

# Export needed vars
set +x
eval "$(./env-toolkit load -f jenkins-env.json \
        BUILD_NUMBER \
        BUILD_URL \
        JENKINS_URL \
        GIT_BRANCH \
        GH_TOKEN \
        NPM_TOKEN \
        GIT_COMMIT \
        QUAY_USERNAME \
        QUAY_PASSWORD \
        DEVSHIFT_TAG_LEN)"
export BUILD_TIMESTAMP=`date -u +%Y-%m-%dT%H:%M:%S`+00:00

# Show command before executing
set -x

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Print date
date

# Get all the deps in
yum -y install docker make git

systemctl start docker
echo "Docker Started: $(date)"

REGISTRY="quay.io"
TAG="1.0.0"
BUILDER_IMAGE=${REGISTRY}/openshiftio/fabric8-ui-fabric8-ui-builder:${TAG}

# Build builder image
if [ -n "${QUAY_USERNAME}" -a -n "${QUAY_PASSWORD}" ]; then
  docker login -u ${QUAY_USERNAME} -p ${QUAY_PASSWORD} ${REGISTRY}
else
  echo "Could not login, missing credentials for the registry"
fi

mkdir -p dist

docker build -t fabric8-ui-builder -f Dockerfile.builder .
docker tag fabric8-ui-builder $BUILDER_IMAGE

docker run --detach=true --name=fabric8-ui-builder -t \
  -v $(pwd)/dist:/dist:Z \
  $BUILDER_IMAGE

echo "NPM Install starting: $(date)"

# Build fabric8-ui
docker exec fabric8-ui-builder npm install
echo "NPM Install Complete: $(date)"

docker exec fabric8-ui-builder npm run bootstrap
echo "Lerna Bootstrap Complete: $(date)"

## Exec unit tests
docker exec fabric8-ui-builder ./run_unit_tests.sh
echo 'CICO: unit tests OK'

./upload_to_codecov.sh


## All ok, build prod version
docker exec fabric8-ui-builder npm run build --prefix ${APP_DIR}
# docker exec -u root "${BUILDER_CONT}" cp -r ${HOME_DIR}/${APP_DIR}/build /
echo 'CICO: build OK'

## Deploy

TAG="PR"$(echo $GIT_COMMIT | cut -c1-${DEVSHIFT_TAG_LEN})
DEPLOY_CONT="fabric8-ui-deploy"


docker build -t "${DEPLOY_CONT}" -f "${DOCKERFILE_DEPLOY}" . && \
docker tag "${DEPLOY_CONT}" "${REGISTRY_URL}:$TAG" && \
docker push "${REGISTRY_URL}:$TAG" && \
docker tag "${DEPLOY_CONT}" "${REGISTRY_URL}:latest" && \
docker push "${REGISTRY_URL}:latest"

if [ $? -eq 0 ]; then
  echo 'CICO: image pushed, npmjs published, ready to update deployed app'
  exit 0
else
  echo 'CICO: Image push to registry failed'
  exit 2
fi
