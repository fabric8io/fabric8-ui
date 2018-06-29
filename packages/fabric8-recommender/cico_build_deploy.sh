#!/bin/bash

set -ex

. cico_setup.sh

install_dependencies

run_unit_tests

build_project

release