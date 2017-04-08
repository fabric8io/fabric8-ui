#!/usr/bin/env bash

LOGFILE=$(pwd)/functional_tests.log
echo Using logfile $LOGFILE

# For the functional tests, we are mocking the core
export NODE_ENV=inmemory

# Start selenium server just for this test run
echo -n Starting Webdriver and Selenium...
(webdriver-manager start --versions.chrome 2.24 >>$LOGFILE 2>&1 &)
# Wait for port 4444 to be listening connections
while ! (ncat -w 1 127.0.0.1 4444 </dev/null >/dev/null 2>&1); do sleep 1; done
echo done.

# Finally run protractor
echo Running tests...
set +x
cat ~/payload/jenkins-env | grep EE_TEST > ~/.ee_test_params
. ~/.ee_test_params
node_modules/protractor/bin/protractor protractorEE.config.js --params.login.user=$EE_TEST_USERNAME --params.login.password=$EE_TEST_PASSWORD
TEST_RESULT=$?
set -x

# Cleanup webdriver-manager and web app processes
fuser -k -n tcp 4444
fuser -k -n tcp 8088

# Return test result
if [ $TEST_RESULT -eq 0 ]; then
  echo 'Functional tests OK'
  exit 0
else
  echo 'Functional tests FAIL'
  exit 1
fi

