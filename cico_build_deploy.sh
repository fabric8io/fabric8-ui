#!/bin/bash

BUILDER_CONT="fabric8-ui-builder"
DEPLOY_CONT="fabric8-ui-deploy"
REGISTRY="push.registry.devshift.net"

if [ "$TARGET" = "rhel" ]; then
  DOCKERFILE_DEPLOY="Dockerfile.deploy.rhel"
  REGISTRY_URL=${REGISTRY}/osio-prod/fabric8-ui/fabric8-ui
else
  DOCKERFILE_DEPLOY="Dockerfile.deploy"
  REGISTRY_URL=${REGISTRY}/fabric8-ui/fabric8-ui
fi

# Show command before executing
set -x

# Exit on error
set -e

# Export needed vars
set +x
for var in BUILD_NUMBER BUILD_URL JENKINS_URL GIT_BRANCH GH_TOKEN NPM_TOKEN GIT_COMMIT DEVSHIFT_USERNAME DEVSHIFT_PASSWORD DEVSHIFT_TAG_LEN; do
  export $(grep ${var} jenkins-env | xargs)
done
export BUILD_TIMESTAMP=`date -u +%Y-%m-%dT%H:%M:%S`+00:00
set -x

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0 || :

# Get all the deps in
yum -y install docker
yum clean all
service docker start

# Build builder image
docker build -t "${BUILDER_CONT}" -f Dockerfile.builder .

# Clean builder container
docker ps | grep -q "${BUILDER_CONT}" && docker stop "${BUILDER_CONT}"
docker ps -a | grep -q "${BUILDER_CONT}" && docker rm "${BUILDER_CONT}"

mkdir -p dist && docker run --detach=true --name="${BUILDER_CONT}" -t -v $(pwd)/dist:/dist:Z -e BUILD_NUMBER -e BUILD_URL -e BUILD_TIMESTAMP -e JENKINS_URL -e GIT_BRANCH -e "CI=true" -e GH_TOKEN -e NPM_TOKEN -e FABRIC8_BRANDING=openshiftio -e FABRIC8_REALM=fabric8 "${BUILDER_CONT}"

# In order to run semantic-release we need a non detached HEAD, see https://github.com/semantic-release/semantic-release/issues/329
docker exec "${BUILDER_CONT}" git checkout master

# Build almigty-ui
docker exec "${BUILDER_CONT}" npm install

## Exec unit tests
docker exec "${BUILDER_CONT}" ./run_unit_tests.sh

  if [ $? -eq 0 ]; then
    echo 'CICO: unit tests OK'
    ./upload_to_codecov.sh
else
  echo 'CICO: unit tests FAIL'
  exit 1
fi

## Exec functional tests
docker exec "${BUILDER_CONT}" ./run_functional_tests.sh

## Run the prod build
docker exec "${BUILDER_CONT}" npm run build:prod

set +e

echo 'CICO: functional tests OK'
docker exec "${BUILDER_CONT}" npm run semantic-release
docker exec -u root "${BUILDER_CONT}" cp -r /home/fabric8/fabric8-ui/dist /

if [ $? -ne 0 ]; then
  echo 'CICO: app tests Failed'
  exit 1
fi

## Deploy
echo 'CICO: build OK'

TAG=$(echo $GIT_COMMIT | cut -c1-${DEVSHIFT_TAG_LEN})

if [ -n "${DEVSHIFT_USERNAME}" -a -n "${DEVSHIFT_PASSWORD}" ]; then
  docker login -u ${DEVSHIFT_USERNAME} -p ${DEVSHIFT_PASSWORD} ${REGISTRY}
else
  echo "Could not login, missing credentials for the registry"
fi

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
