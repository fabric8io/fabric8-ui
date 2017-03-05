#!/bin/bash

# Show command before executing
set -x

# Exit on error
set -e

# Export needed vars
for var in BUILD_NUMBER BUILD_URL; do
  export $(grep ${var} jenkins-env | xargs)
done
export BUILD_TIMESTAMP=`date -u +%Y-%m-%dT%H:%M:%S`+00:00

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install docker
yum clean all
service docker start

# Build builder image
docker build -t fabric8-ui-builder -f Dockerfile.builder .
mkdir -p dist && docker run --detach=true --name=fabric8-ui-builder -t -v $(pwd)/dist:/dist:Z -e BUILD_NUMBER -e BUILD_URL -e BUILD_TIMESTAMP -e JENKINS_URL -e GIT_BRANCH -e "CI=true" -e GH_TOKEN -e NPM_TOKEN fabric8-ui-builder

# Build almigty-ui
docker exec fabric8-ui-builder npm install

## Exec unit tests
docker exec fabric8-ui-builder ./run_unit_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: unit tests OK'
else
  echo 'CICO: unit tests FAIL'
  exit 1
fi

## Exec functional tests
docker exec fabric8-ui-builder ./run_functional_tests.sh

if [ $? -eq 0 ]; then
  echo 'CICO: functional tests OK'
  docker exec fabric8-ui-builder npm run build:prod
  docker exec -u root fabric8-ui-builder cp -r /home/fabric8/fabric8-ui/dist /
  ## All ok, deploy
  if [ $? -eq 0 ]; then
    echo 'CICO: build OK'
    set -e
    docker build -t fabric-ui-deploy -f Dockerfile.deploy . && \
    docker tag fabric-ui-deploy 8.43.84.245.xip.io/fabric8io/fabric8-ui:latest
    docker push 8.43.84.245.xip.io/fabric8io/fabric8-ui:latest
    docker exec fabric8-planner-builder npm run semantic-release
    if [ $? -eq 0 ]; then
      echo 'CICO: image pushed, npmjs published, ready to update deployed app'
      exit 0
    else
      echo 'CICO: Image push to registry failed'
      exit 2
    fi
  else
    echo 'CICO: app tests Failed'
    exit 1
  fi
else
  echo 'CICO: functional tests FAIL'
  exit 1
fi

