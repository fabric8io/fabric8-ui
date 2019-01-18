#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
# It will:
#   1. Build fabric8-planner 
#   2. Update Tag on github
#   3. Push fabric8-planner to npmjs.org
#   4. Create PR with new planner version on fabric8-npm-dependencies repo
#   5. Merge the PR on fabric8-npm-dependencies repo

# Show command before executing
set -x

# Exit on error
set -e

# This option sets the exit code of a pipeline to that of the rightmost command to exit with a
# non-zero status, or to zero if all commands of the pipeline exit successfully.
set -o pipefail

source cico_setup.sh

setup

# Build fabric8-planner image
docker build -t fabric8-planner-builder .

# User root is required to run webdriver-manager update.
# This shouldn't be a problem for CI containers
# Chrome crashes on low size of /dev/shm. We need the --shm-size=256m flag.
CID=$(docker run --detach=true \
    --shm-size=256m \
    -u $(shell id -u $(USER)):$(shell id -g $(USER)) \
    -v $(pwd)/fabric8-ui-dist:/home/fabric8/fabric8-planner/fabric8-ui-dist:Z \
    --cap-add=SYS_ADMIN \
    -t fabric8-planner-builder)

build_planner

run_unit_tests

build_fabric8_ui

build_test_and_push_image

docker exec -e GH_TOKEN=$GH_TOKEN -e NPM_TOKEN=$NPM_TOKEN -e JENKINS_URL=$JENKINS_URL -e GIT_BRANCH=$GIT_BRANCH $CID bash -c 'sh cico_release.sh'
