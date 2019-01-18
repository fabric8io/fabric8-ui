#!/bin/bash
set -x

docker build -t fabric8-planner-builder -f Dockerfile .
mkdir -p runtime/dist && docker run --detach=true --name=fabric8-planner-builder --user=root --cap-add=SYS_ADMIN -t -v $(pwd)/runtime/dist:/dist:Z fabric8-planner-builder
docker exec fabric8-planner-builder npm install
docker exec fabric8-planner-builder npm run tests -- --unit
docker exec fabric8-planner-builder npm run build
docker exec fabric8-planner-builder bash -c "cd runtime ; npm link ../dist --production"
docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm install"

if [[ "$1" == "functionalTests" ]]; then
  echo "Running functional tests..."
  docker exec fabric8-planner-builder bash -c "cd runtime ; npm run test:funcsmoke"
fi

docker exec  -i fabric8-planner-builder bash -c "cd runtime ; npm run build"

