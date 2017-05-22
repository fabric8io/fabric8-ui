
#!/usr/bin/env bash

# Show command before executing
set -x

# Exist when command returns not 0
set -e

# Ensure all Jenkins variables are set (e.g. commit, branch, etc.)
if [ -e "jenkins-env" ]; then
  source jenkins-env
fi

bash <(curl -s https://codecov.io/bash) -t 2e7e06e5-1518-4680-93cb-cf6c80b9e38e #-X fix
