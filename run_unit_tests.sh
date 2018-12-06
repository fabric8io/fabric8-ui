#!/usr/bin/env bash

LOGFILE=$(pwd)/unit_tests.log
echo Using logfile $LOGFILE

# Running npm test
echo Running unit tests...
# run test script inside monorepo fabric8-ui package
(cd talamer/packages/fabric8-ui && npm run test | tee $LOGFILE ; UNIT_TEST_RESULT=${PIPESTATUS[0]})

if [ $UNIT_TEST_RESULT -eq 0 ]; then
  echo 'Unit tests OK'
  exit 0
else
  echo 'Unit tests FAIL'
  exit 1
fi
