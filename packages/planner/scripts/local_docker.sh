#!/bin/bash

docker build -t fabric8-ui-builder -f Dockerfile .
mkdir -p runtime/dist && docker run --detach=true --name=fabric8-ui-builder -e "API_URL=http://demo.api.openshift.io/api/" -t -v $(pwd)/runtime/dist:/dist:Z fabric8-ui-builder
docker exec fabric8-ui-builder npm install
docker exec fabric8-ui-builder npm run tests -- --unit

if [[ "$1" == "functionalTests" ]]; then
  echo "Running functional tests..."
  docker exec fabric8-ui-builder ./scripts/run-functests.sh
fi

docker exec -u root fabric8-ui-builder cp -r /home/fabric8/fabric8-planner/dist /
docker build -t fabric8-ui-deploy -f ./deploy/Dockerfile.deploy .

docker stop fabric8-ui-builder
docker rm -f fabric8-ui-builder
