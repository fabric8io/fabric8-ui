#!/usr/bin/env bash

# This runs the tests

declare -r CURRENT_DIR=$(pwd)
declare -r SCRIPT_PATH=$(readlink -f "$0")
declare -r SCRIPT_DIR=$(cd $(dirname "$SCRIPT_PATH") && pwd)

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
log.pass()  { _log "${GREEN}PASS" "$*"; }
log.fail()  { _log "${RED}FAIL" "$*"; }

wait_for() {
# First arg is the command to execute
  local WAIT_LIMIT=5
  local NEXT_WAIT_TIME=0
  until $1 || [ $NEXT_WAIT_TIME -eq $WAIT_LIMIT ]; do
    sleep $(( NEXT_WAIT_TIME++ ))
  done
}

## Process Control Functions

start_webdriver() {
  local log_file="./webdriver.log"; shift

  # Start selenium server just for this test run
  log.info "Starting Webdriver and Selenium..."
  log.info "Webdriver will log to:$GREEN $log_file"
  npm run webdriver:update -- --versions.chrome $WEBDRIVER_VERSION
  npm run webdriver:start -- --versions.chrome $WEBDRIVER_VERSION >> "$log_file" 2>&1 &
  webdriver_pid=$!
}

webdriver_running() {
  curl --output /dev/null --silent --head --fail 127.0.0.1:4444
}

wait_for_webdriver() {
  log.info "Waiting for the webdriver to start ..."
  wait_for webdriver_running
  log.info "Webdriver manager up and running - OK"
}

clean_up() {
  # Kill webdirver process.
  if [[ -n ${webdriver_pid+x} ]]; then
    kill $webdriver_pid
  fi
  cd $CURRENT_DIR
}
trap clean_up EXIT

main() {
  local base_url=${BASE_URL:-"http://localhost:8080/"}
  local temp_dir=${TEMP_DIR:-$(mktemp -d)}
  local specs_pattern=${SPECS_PATTERN:-"${temp_dir}/**/*.spec.js"}
  local test_source_path=${TEST_SOURCE_PATH:-"../src/tests"}
  local protractor="$(npm bin)/protractor"
  local typescript="$(npm bin)/tsc"
  local suite=${1:-""}

  echo "Getting local dependencies.."
  npm install

  echo "Using ${temp_dir} as working directory"

  if [[ -z ${TEST_SOURCE_PATH+x} ]]; then
    echo "TEST_SOURCE_PATH is not set, using ${test_source_path}"
  fi

  # Compile tests and base files
  echo "Compiling tests.."
  ${typescript} --outDir "${temp_dir}" --project "${test_source_path}"
  ${typescript} --outDir "${temp_dir}" --project "."

  echo "Getting test context dependencies.."
  cp "package.json" "${temp_dir}/"
  cd "${temp_dir}" && npm install

  echo "Using base url ${base_url}"

  if [[ ${DIRECT_CONNECT:-false} == false ]]; then
    echo "DIRECT_CONNECT not set; Using webdriver. Tests may run slow .. checking webdriver status"
    echo
    webdriver_running || {
      start_webdriver
      wait_for_webdriver
    }
  else
    echo "DIRECT_CONNECT is set; using direct connection (faster)"
    echo
  fi

  if [[ ${HEADLES_MODE:-false} == true ]]; then
    echo "HEADLESS_MODE is set. Chrome will run in headless mode"
    echo
  fi

  AUTH_TOKEN=$AUTH_TOKEN REFRESH_TOKEN=$REFRESH_TOKEN $protractor --baseUrl "${base_url}" \
    --specs "${specs_pattern}" \
    --exclude "node_modules/**/*.spec.js" \
    --suite "${suite}" \
    "${temp_dir}/protractor.conf.js"

  TEST_RESULT=$?

  # Return test result
  if [ $TEST_RESULT -eq 0 ]; then
    echo 'Functional tests OK'
    exit 0
  else
    echo 'Functional tests FAIL'
    exit 1
  fi

  clean_up
}

main "$@"
