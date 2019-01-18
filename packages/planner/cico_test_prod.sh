#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
# Run functional tests for fabric8-planner on prod and prod-preview
set -x

# Exit on error
set -e

# Source environment variables of the jenkins slave
# that might interest this worker
if [ -e "config/jenkins-env" ]; then
  cat config/jenkins-env \
    | grep -E "^(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|USER_NAME|PASSWORD|BUILD_NUMBER|REFRESH_TOKEN|ARTIFACT_PASS)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

prod=true
# Set prod to false, to run tests on prod-preview
if [[ "$1" == "--prod-preview" ]]; then
  prod=false
fi

if $prod; then
  FABRIC8_WIT_API_URL="https://api.openshift.io/"
  USER_NAME="osio-ci-planner-002"
  BASE_URL='https://openshift.io/'
else
  FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/"
  USER_NAME="osio-ci-planner-002-preview"
  BASE_URL='https://prod-preview.openshift.io'
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# install dependency
yum -y install docker
service docker start

# tests image
docker build -t tests .

CID=$(docker run --detach=true \
    --shm-size=256m \
    -t tests)

# Get all the deps in
echo "Container name: $CID"

docker exec $CID bash -c 'npm i && cd tests'

docker exec -t -e REFRESH_TOKEN=$REFRESH_TOKEN $CID bash -c \
  "cd tests && WEBDRIVER_VERSION=2.37 DEBUG=true HEADLESS_MODE=true USER_NAME=$USER_NAME FABRIC8_WIT_API_URL=$FABRIC8_WIT_API_URL BASE_URL=$BASE_URL ./run_e2e_tests.sh"
