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
/usr/sbin/setenforce 0 || :

# Get all the deps in
yum -y install docker
yum clean all
service docker start

# Build builder image
docker build -t fabric8-ui-builder -f Dockerfile.builder .

if [ ! -d dist ]; then
  mkdir dist
  docker run --detach=true --name=fabric8-ui-builder -t  -v $(pwd)/dist:/dist:Z
    -e BUILD_NUMBER -e BUILD_URL -e BUILD_TIMESTAMP -e JENKINS_URL \
    -e GIT_BRANCH -e "CI=true" -e GH_TOKEN -e NPM_TOKEN \
    -e FABRIC8_BRANDING=openshiftio -e FABRIC8_REALM=fabric8 fabric8-ui-builder
fi

# In order to run semantic-release we need a non detached HEAD, see https://github.com/semantic-release/semantic-release/issues/329
docker exec fabric8-ui-builder git checkout master

# Build almigty-ui
docker exec fabric8-ui-builder npm install

## Exec unit tests
docker exec fabric8-ui-builder ./run_unit_tests.sh
echo 'CICO: unit tests OK'

./upload_to_codecov.sh

## Exec functional tests
docker exec fabric8-ui-builder ./run_functional_tests.sh

## Run the prod build
docker exec fabric8-ui-builder npm run build:prod
echo 'CICO: functional tests OK'

docker exec fabric8-ui-builder npm run semantic-release
docker exec -u root fabric8-ui-builder cp -r /home/fabric8/fabric8-ui/dist /
docler rm fabric8-ui-builder

echo 'CICO: build OK'

TAG=$(echo $GIT_COMMIT | cut -c1-${DEVSHIFT_TAG_LEN})

REGISTRY=${DOCKER_REGISTRY:-"push.registry.devshift.net/osio-prod"}

if [ -n "${DEVSHIFT_USERNAME}" -a -n "${DEVSHIFT_PASSWORD}" ]; then
  docker login -u ${DEVSHIFT_USERNAME} -p ${DEVSHIFT_PASSWORD} ${REGISTRY}
else
  echo "Could not login, missing credentials for the registry"
  exit 1
fi

if [ "$TARGET" = "rhel" ]; then
  DOCKERFILE_DEPLOY="Dockerfile.deploy.rhel"
  IMAGE_URI=${REGISTRY}/osio-prod/fabric8-ui/fabric8-ui
else
  DOCKERFILE_DEPLOY="Dockerfile.deploy"
  IMAGE_URI=${REGISTRY}/fabric8-ui/fabric8-ui
fi

docker build -t fabric8-ui-deploy -f ${DOCKERFILE_DEPLOY} .

docker tag fabric8-ui-deploy ${IMAGE_URI}:$TAG
docker tag fabric8-ui-deploy ${IMAGE_URI}:latest

docker push ${IMAGE_URI}:$TAG
docker push ${IMAGE_URI}:latest

echo 'CICO: image pushed, npmjs published, ready to update deployed app'

exit 0
