#!/bin/bash

set -ex

load_jenkins_vars() {
  if [ -e "jenkins-env" ]; then
        grep -E "(
            BUILD_NUMBER|
            BUILD_URL|
            DEVSHIFT_PASSWORD|
            DEVSHIFT_TAG_LEN|
            DEVSHIFT_USERNAME|
            GH_TOKEN|
            GIT_BRANCH|
            GIT_COMMIT|
            ghprbActualCommit|
            ghprbPullId|
            ghprbSourceBranch|
            JENKINS_URL|
            NPM_TOKEN|
            QUAY_USERNAME|
            QUAY_PASSWORD|
            RECOMMENDER_API_TOKEN
          )=" \
          jenkins-env \
        | sed 's/^/export /g' \
        > ~/.jenkins-env
      source ~/.jenkins-env

      echo "CICO: Jenkins environment variables loaded"
  fi
  export BUILD_TIMESTAMP=`date -u +%Y-%m-%dT%H:%M:%S`+00:00
}

prep() {
  # We need to disable selinux for now, XXX
  /usr/sbin/setenforce 0


  yum -y update
  yum -y install docker make gcc-c++ bzip2 fontconfig

  # Get and set up git v2.12
  yum -y install centos-release-scl
  yum -y install sclo-git212.x86_64
  export PATH=${PATH}:/opt/rh/sclo-git212/root/usr/bin/

  # Get and set up Nodejs
  curl -sL https://rpm.nodesource.com/setup_8.x | sudo -E bash -
  yum -y install nodejs
}

install_dependencies() {
  npm install;
  chmod +x /root/payload/node_modules/phantomjs-prebuilt/lib/phantom/bin/phantomjs

  # set up chrome for running tests
  cp config/google-chrome.repo /etc/yum.repos.d/google-chrome.repo
  yum install -y google-chrome-stable

  if [ $? -eq 0 ]; then
      echo 'CICO: npm install : OK'
  else
      echo 'CICO: npm install : FAIL'
      exit 1
  fi

  service docker start
}

run_unit_tests() {
  # Set up logging
  LOGFILE=$(pwd)/unit_tests.log
  echo Using logfile $LOGFILE

  # Running npm test
  echo Running unit tests...
  npm run test | tee $LOGFILE ; UNIT_TEST_RESULT=${PIPESTATUS[0]}

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
