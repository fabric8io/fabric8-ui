
#!/usr/bin/env bash

# Show command before executing
set -x

# Exist when command returns not 0
set -e

# Ensure all Jenkins variables are set (e.g. commit, branch, etc.)
if [ -e "jenkins-env" ]; then
  source jenkins-env
fi

bash <(curl -s https://codecov.io/bash) -t 274c63b8-b698-425d-a0ab-6a4020eca599 -f coverage/coverage.json
