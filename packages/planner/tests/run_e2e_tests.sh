#!/bin/bash
set -euo pipefail

declare -r temp_dir=${TEMP_DIR:-$(mktemp -d)}
declare USER_NAME=${USER_NAME:-"ijarif-test-preview"}
declare FABRIC8_WIT_API_URL=${FABRIC8_WIT_API_URL:-"https://api.prod-preview.openshift.io"}

cleanup() {
  for key in OFFLINE_TOKEN SPACE_NAME TOKEN USER_FULLNAME USER_ID USER_NAME FABRIC8_WIT_API_URL; do
    unset "$key";
  done

  # Remove fabric8-test repo
  rm -rf $temp_dir
}

# Exit handler
trap cleanup EXIT

clone_fabric8_test() {
  log "Cloning fabric8-test to $temp_dir"
  git clone https://github.com/fabric8io/fabric8-test.git $temp_dir/fabric8-test
}

generate_db() {
  cd $temp_dir/fabric8-test/EE_API_automation/pytest
  log "Installing python pip"
  yum install -y epel-release && yum install -y python-pip
  log "Installing all the required packages..."
  pip install --upgrade pip
  pip install pytest requests jmespath
  log "Running the EE_API_Automation Tests (DB Generation)"
  sh run_me.sh "$FABRIC8_WIT_API_URL" "$USER_NAME" "$REFRESH_TOKEN"
}

log() {
  echo
  echo -e "\e[93m============================================================"
  echo $1
  echo -e "============================================================\e[0m"
}

run_tests() {
  log "Running Planner Functional Tests"
  BASE_URL=$BASE_URL AUTH_TOKEN=$TOKEN REFRESH_TOKEN=$OFFLINE_TOKEN ./run.sh
}

setup_environment() {
  log "Setting up required environment variables"
  eval $(cat launch_info_dump.json | ./json2env)
}

# Make sure required variables are set
validate_env() {
  err=''
  if [[ -z ${FABRIC8_WIT_API_URL+x} ]]; then
    err="$err\nFABRIC8_WIT_API_URL not set. Please set the variable and try again."
  fi
  if [[ -z ${USER_NAME+x} ]]; then
    err="$err\nUSER_NAME not set. Please set the variable and try again."
  fi
  if [[ -z ${REFRESH_TOKEN+x} ]]; then
    err="$err\nREFRESH_TOKEN not set. Please set the variable and try again."
  fi
  if [[ $err ]]; then
    echo -e "\e[31m=============================================================="
    printf "$err\n"
    echo -e "==============================================================\e[0m"
    exit
  fi
}

main() {
  SCRIPT_DIR=$(cd $(dirname "$0") && pwd)
  validate_env
  clone_fabric8_test
  generate_db
  setup_environment
  cd $SCRIPT_DIR
  run_tests
}

main "@$"