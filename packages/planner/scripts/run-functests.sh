#!/bin/bash
set -e -u -o pipefail

declare -r CURRENT_DIR=$(pwd)
declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)
declare -r PLANNER_PORT=8090

### Utility Functions

declare -r RED='\e[31m'
declare -r GREEN='\e[32m'
declare -r YELLOW='\e[33m'
declare -r BLUE='\e[34m'
declare -r MAGENTA='\e[35m'
declare -r CYAN='\e[36m'
declare -r WHITE='\e[37m'
declare -r BOLD='\e[1m'
declare -r RESET='\e[0m'

_log() {
  local status="$1"; shift
  echo -e "${status}:$RESET ${*}$RESET" >&2
}

log.debug() {
  debug_enabled || return 0
  local caller_file=${BASH_SOURCE[1]##*/}
  local caller_line=${BASH_LINENO[0]}
  local caller_info="${WHITE}$caller_file${BLUE}(${caller_line}${BLUE})"
  local caller_fn=""
  if [ ${#FUNCNAME[@]} != 2 ]; then
      caller_fn="${FUNCNAME[1]:+${FUNCNAME[1]}}"
      caller_info+=" ${GREEN}$caller_fn"
  fi
  _log "${caller_info}" "$*" >&2
}

log.info()  { _log "$GREEN${BOLD}INFO" "$*"; }
log.warn()  { _log "${YELLOW}WARNING" "$*"; }
log.error() { _log "${RED}ERROR" "$*"; }

debug_enabled() {
  [[ ${DEBUG:-false} == true ]]
}

wait_for() {
  # First arg is the command to execute
  local WAIT_LIMIT=5
  local NEXT_WAIT_TIME=0

  until $1 || [ $NEXT_WAIT_TIME -eq $WAIT_LIMIT ]; do
    sleep $(( NEXT_WAIT_TIME++ ))
  done
}

## Process Control Functions

check_port_free() {
  # Check if port specified by $1 is free, else exit
  if nc -z 127.0.0.1 $1; then
    log.error "Cannot start planner. Port $PLANNER_PORT already in use by another process. Please free up the port and try again."
    exit 1
  fi
}

start_planner() {
  check_port_free $PLANNER_PORT
  log.info "NODE_ENV=inmemory mode set; Planner will use mock data"
  NODE_ENV=inmemory npm run server:test -- --port $PLANNER_PORT &
  planner_pid=$!
}

planner_running() {
  curl --output /dev/null --silent --connect-timeout 1 --max-time 1 localhost:$PLANNER_PORT
}

wait_for_planner() {
  log.info "Waiting for the planner to start "
  wait_for planner_running
  log.info "Planner up and running - OK"
}

clean_up() {
  # Kill webpack-dev-server process.
  if [[ -n ${planner_pid+x} ]]; then
    kill $planner_pid
  fi
  cd $CURRENT_DIR
}
trap clean_up EXIT

cd $SCRIPT_DIR

main() {
  # BASE_URL is set means planner is already running.
  # Start planner only if BASE_URL is not set
  if [[ -z ${BASE_URL+x} ]]; then
    log.info "Entering $SCRIPT_DIR/.."
    cd $SCRIPT_DIR/..

    log.info "Starting planner locally (inmemory mode) ..."

    log.info "Installing Dependencies..."
    npm install

    log.info "Building Planner..."
    mkdir -p dist && cp package.json dist/ && npm run build

    log.info "Installing Runtime Dependencies..."
    log.info "Entering $SCRIPT_DIR/../runtime"
    cd $SCRIPT_DIR/../runtime
    npm install

    start_planner
    wait_for_planner
  fi

  export BASE_URL="${BASE_URL:-http://localhost:$PLANNER_PORT}"
  export WEBDRIVER_VERSION="${WEBDRIVER_VERSION:-2.33}"
  log.info "Entering $SCRIPT_DIR/../tests"
  cd $SCRIPT_DIR/../tests
  log.info "Running Functional Tests..."
  ./run.sh

  clean_up
}

main "$@"
