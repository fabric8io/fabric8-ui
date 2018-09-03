#!/bin/bash

set -ex

load_jenkins_vars() {
  if [ -e "jenkins-env" ]; then
      cat jenkins-env \
        | grep -E "(DEVSHIFT_TAG_LEN|DEVSHIFT_USERNAME|DEVSHIFT_PASSWORD|JENKINS_URL|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId|RECOMMENDER_API_TOKEN|NPM_TOKEN|GH_TOKEN)=" \
        | sed 's/^/export /g' \
        > ~/.jenkins-env
      source ~/.jenkins-env

      echo "CICO: Jenkins environment variables loaded"
  fi
}

prep() {
  yum -y update
  yum -y install docker make gcc-c++ bzip2 fontconfig
  cp e2e/google-chrome.repo /etc/yum.repos.d/google-chrome.repo
  yum install -y google-chrome-stable

  # Get and set up git v2.12
  yum -y install centos-release-scl
  yum -y install sclo-git212.x86_64
  export PATH=${PATH}:/opt/rh/sclo-git212/root/usr/bin/

  # Get and set up Nodejs
  curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
  yum -y install nodejs
}

install_dependencies() {
  # Build fabric8-analytics-stack-reports-ui
  npm install;

  if [ $? -eq 0 ]; then
      echo 'CICO: npm install : OK'
  else
      echo 'CICO: npm install : FAIL'
      exit 1
  fi
}

run_unit_tests() {
  # Exec unit tests
  npm run test

  if [ $? -eq 0 ]; then
      echo 'CICO: unit tests OK'
  else
      echo 'CICO: unit tests FAIL'
      exit 2
  fi
}

build_project() {
  # run build
  npm run build

  if [ $? -eq 0 ]; then
    echo 'CICO: build OK'
  else
    echo 'CICO: build FAIL'
    exit 1
  fi
}

. cico_release.sh

load_jenkins_vars

prep
