#!/bin/bash

# Show command before executing
set -x

set -e

# Source environment variables of the jenkins slave
# that might interest this worker.
if [ -e "jenkins-env" ]; then
  cat jenkins-env \
    | grep -E "(JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId)=" \
    | sed 's/^/export /g' \
    > /tmp/jenkins-env
  source /tmp/jenkins-env
fi

# We need to disable selinux for now, XXX
/usr/sbin/setenforce 0

# Get all the deps in
yum -y install \
  docker \
  make \
  git
service docker start

# Build builder image
cp /tmp/jenkins-env .
docker build -t fabric8-ui-builder -f Dockerfile.builder .
# User root is required to run webdriver-manager update. This shouldn't be a problem for CI containers
mkdir -p dist && docker run --detach=true --name=fabric8-ui-builder --user=root --cap-add=SYS_ADMIN -e EE_TEST_USERNAME=$EE_TEST_USERNAME -e EE_TEST_PASSWORD=$EE_TEST_PASSWORD -e "API_URL=http://api.prod-preview.openshift.io/api/" -e "CI=true" -t -v $(pwd)/dist:/dist:Z fabric8-ui-builder

# Build
docker exec fabric8-ui-builder npm install

## Clean up OpenShift builds, pipelines, etc. from prior jobs - commented out for now - until test can run more reliably
##
##docker exec fabric8-ui-builder wget https://github.com/openshift/origin/releases/download/v1.5.0/openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit.tar.gz
##
##docker exec fabric8-ui-builder tar -xzvf openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit.tar.gz
##
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc login https://api.starter-us-east-2.openshift.com --token=$2
##
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete bc --all -n almusertest1
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-test
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-stage
##docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc delete build --all -n almusertest1-run

## Delete/cleanup Jenkins jobs - commented out for now - until test can run more reliably
##
## export TOKEN=`docker exec fabric8-ui-builder cat ../.kube/config | grep token | sed -e 's/token://g' |  sed -e 's/ //g'`
## export ID=`docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc whoami`
## export GITID=almightytest
##
## curl  -d "json=%7B%7D&Submit=Yes"  -X POST -H "Authorization: Bearer ${TOKEN}" -H "Referer: https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/delete" -H "Content-Type: application/x-www-form-urlencoded" https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/doDelete

# Exec EE tests
docker exec fabric8-ui-builder ./run_EE_tests.sh $1

# Test results to archive
docker cp fabric8-ui-builder:/home/fabric8/fabric8-ui/target/ .
docker cp fabric8-ui-builder:/home/fabric8/fabric8-ui/functional_tests.log target
