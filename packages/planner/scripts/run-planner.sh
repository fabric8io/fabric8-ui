#!/bin/bash

# This script runs the Planner-Platform integration in one go.
# It has the following commandline options:
#
#   -r reinstalls all needed components before launching
#   -s runs in standalone (non-Plaform mode)
#   -p <planner_home_dir> sets the Planner home, defaults to current directory
#   -f <platform_home_dir> sets the Platform home, defaults to <current directory>/../fabric8-ui
#
# NOTE: this does not set any run mode or api url environment for non-standalone mode. If you
# need that, set it as usual before launching this script.

set -euo pipefail

# get the script's absolute path
declare -r SCRIPTPATH=$(realpath $(dirname $0))

# defaults to script's parent dir and the common git name in parent
declare -r PLANNER_HOME=$(realpath "$SCRIPTPATH/..")
declare -r PLATFORM_HOME=$(realpath "$PLANNER_HOME/../fabric8-ui")
declare REINSTALL=0
declare STANDALONE=0

# fire up getopt
declare -r options=`getopt -o rsp:f: --long reinstall,standalone,plannerhome:,platformhome: -n 'run-planner.sh' -- "$@"`
eval set -- "$options"

trap "trap - SIGTERM && kill -- -$$" INT TERM EXIT

function log {
  echo
  echo -e "\e[93m============================================================"
  echo $1
  echo -e "============================================================\e[0m"
}

function buildPlanner {
  log "Building Planner"
  cd $PLANNER_HOME && npm run build -- --watch &
  # This sleep is necessary since the build takes about 15 secs.
  # We need to wait for the build to complete.
  sleep 20
}

function reinstallPlannerAndBuild {
  log "Installing Planner dependencies"
  cd $PLANNER_HOME && npm run reinstall
  buildPlanner
}

function linkPlannerTo {
  log "Linking Planner to $1"
  cd $1 && npm link $PLANNER_HOME/dist --production
}

function serveProject {
  log "Running Planner in $1"
  cd $1 && npm start
}

function runIntegrated {
  declare buildDone=0
  if [ $REINSTALL -eq 1 ]; then
    reinstallPlannerAndBuild
    buildDone=1
    if [ ! -d "$PLATFORM_HOME" ]; then
      log "Platform directory not found. Cloning fabric8-ui repository to $PLATFORM_HOME"
      git clone https://github.com/fabric8-ui/fabric8-ui.git $PLATFORM_HOME
    fi
    log "Installing Platform dependencies"
    cd $PLATFORM_HOME && npm run reinstall
  fi

  if [ $buildDone -eq 0 ]; then
    buildPlanner
  fi

  linkPlannerTo $PLATFORM_HOME

  serveProject $PLATFORM_HOME
}

# runs the standalone Runtime
function runStandalone {
  declare buildDone=0
  if [ $REINSTALL -eq 1 ]; then
    reinstallPlannerAndBuild
    buildDone=1
    log "Installing Planner Runtime dependencies"
    cd $PLANNER_HOME/runtime && npm run reinstall
  fi

  if [ $buildDone -eq 0 ]; then
    buildPlanner
  fi

  linkPlannerTo "$PLANNER_HOME/runtime"

  serveProject "$PLANNER_HOME/runtime"
}

# extract options and their arguments into variables.
while true ; do
    case "$1" in
        -r|--reinstall) REINSTALL=1 ; shift ;;
        -s|--standalone) STANDALONE=1 ; shift ;;
        -p|--plannerhome)
            case "$2" in
                "") shift 2 ;;
                *) PLANNER_HOME=$2 ; shift 2 ;;
            esac ;;
        -f|--platformhome)
            case "$2" in
                "") shift 2 ;;
                *) PLATFORM_HOME=$2 ; shift 2 ;;
            esac ;;
        --) shift ; break ;;
        *) echo "Internal error!" ; exit 1 ;;
    esac
done

if [ $STANDALONE -eq 1 ]; then
  runStandalone
else
  runIntegrated
fi
