#!/bin/bash

# This file is supposed to be executed by CICO build (ci.centos.org/view/Devtools/)
#   1. Run tests for fabric8-planner
#   2. Create snapshot with fabric8-ui's master and fabric8-planner's current changes

# Show command before executing
set -x

# Exit on error
set -e

source cico_setup.sh

setup

# Build fabric8-planner image
docker build -t fabric8-planner-builder .

# User root is required to run webdriver-manager update.
# This shouldn't be a problem for CI containers
# Chrome crashes on low size of /dev/shm. We need the --shm-size=256m flag.
CID=$(docker run --detach=true \
    --shm-size=256m \
    -v $(pwd)/fabric8-ui-dist:/home/fabric8/fabric8-planner/fabric8-ui-dist:Z \
    --cap-add=SYS_ADMIN \
    -t fabric8-planner-builder)

build_planner

run_unit_tests

build_fabric8_ui

build_test_and_push_image
