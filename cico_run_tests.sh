#!/bin/bash

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
/usr/sbin/setenforce 0
echo "$(date) $line"
# Get all the deps in
yum -y install \
  docker \
  make \
  git
service docker start
echo "Docker Started: $(date) $line"

REGISTRY="push.registry.devshift.net"
PULLREGISTRY="registry.devshift.net"
TAG="1.0.0"

# Build builder image
if [ -n "${DEVSHIFT_USERNAME}" -a -n "${DEVSHIFT_PASSWORD}" ]; then
  docker login -u ${DEVSHIFT_USERNAME} -p ${DEVSHIFT_PASSWORD} ${REGISTRY}
else
  echo "Could not login, missing credentials for the registry"
fi

mkdir -p dist
docker run --detach=true --name=fabric8-ui-builder -t -v $(pwd)/dist:/dist:Z ${PULLREGISTRY}/fabric8-ui/fabric8-ui-builder:${TAG}

if [[ $? -ne 0 ]]; then
  docker build -t fabric8-ui-builder -f Dockerfile.builder . && \
  docker tag fabric8-ui-builder ${REGISTRY}/fabric8-ui/fabric8-ui-builder:${TAG} && \
  docker push ${REGISTRY}/fabric8-ui/fabric8-ui-builder:${TAG}
  docker run --detach=true --name=fabric8-ui-builder -t -v $(pwd)/dist:/dist:Z ${PULLREGISTRY}/fabric8-ui/fabric8-ui-builder:${TAG}
fi

echo "NPM Install starting: $(date) $line"

# Build almighty-ui
docker exec fabric8-ui-builder npm install
echo "NPM Install Complete: $(date) $line"
## Exec unit tests
docker exec fabric8-ui-builder ./run_unit_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: unit tests OK'
  ./upload_to_codecov.sh
else
  echo 'CICO: unit tests FAIL'
  exit 1
fi

## Exec functional tests
docker exec fabric8-ui-builder ./run_functional_tests.sh

## All ok, build prod version
if [ $? -eq 0 ]; then
  echo 'CICO: functional tests OK'
  docker exec fabric8-ui-builder npm run build:prod
else
  echo 'CICO: functional tests FAIL'
  exit 1
fi
echo "Build Complete: $(date) $line"

