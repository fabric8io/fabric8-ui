#!/usr/bin/env bash

# Show command before executing
set -x

# Exist when command returns not 0
set -e

# Ensure all Jenkins variables are set (e.g. commit, branch, etc.)
if [ -e "jenkins-env" ]; then
  # Only try to source lines with an equal sign in them.
  grep "=" jenkins-env > jenkins-env.clean
  source jenkins-env.clean
fi

bash <(curl -s https://codecov.io/bash) -t 274c63b8-b698-425d-a0ab-6a4020eca599 -f coverage/coverage.json
