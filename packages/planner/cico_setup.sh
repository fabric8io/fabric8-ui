#!/bin/bash

# Source environment variables of the jenkins slave
# that might interest this worker.
function load_jenkins_vars() {
    if [ -e "jenkins-env" ]; then
        cat jenkins-env \
        | grep -E "^(JENKINS_URL|QUAY_USERNAME|QUAY_PASSWORD|GIT_BRANCH|GIT_COMMIT|BUILD_NUMBER|ghprbSourceBranch|ghprbActualCommit|BUILD_URL|ghprbPullId|DEVSHIFT_TAG_LEN|GIT_COMMIT|NPM_TOKEN|GH_TOKEN|REFRESH_TOKEN)=" \
        | sed 's/^/export /g' \
        > /tmp/jenkins-env
        source /tmp/jenkins-env
    fi
    echo "CICO: Jenkins environment variables loaded"
}

function install_deps() {
    # We need to disable selinux for now, XXX
    /usr/sbin/setenforce 0

    # Get all the deps in
    yum -y install docker
    service docker start
    echo "CICO: Dependencies installed"
}

function setup() {
    load_jenkins_vars;

    install_deps;

    mkdir -p fabric8-ui-dist

}

function build_planner() {
    # Build fabric8-planner
    docker exec $CID npm install
    docker exec $CID npm run build
    docker exec $CID npm pack dist/
    echo "CICO: Planner build completed"
}

function run_unit_tests() {
    # Run unit tests
    docker exec $CID npm run tests -- --unit \
        && bash <(curl -s https://codecov.io/bash) -f ./coverage/*/coverage-final.json -t 73933b5a-4aba-4b55-8612-a809ca4ada30
}

function run_functional_tests() {
    # Run the docker image
    SERVER_CID=$(docker run --detach fabric8-planner-snapshot)
    SERVER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' ${SERVER_CID})

    # Run the E2E tests against the running fabric8-ui container
    docker exec -t -e REFRESH_TOKEN=$REFRESH_TOKEN $CID bash -c \
        "cd tests && WEBDRIVER_VERSION=2.37 DEBUG=true HEADLESS_MODE=true BASE_URL='http://${SERVER_IP}:8080' ./run_e2e_tests.sh"
}

function build_fabric8_ui() {
    # Build and integrate planner with fabric8-ui
    docker exec $CID git clone https://github.com/fabric8-ui/fabric8-ui.git
    # Do not remove the --unsafe-perm flag.
    # fabric8-ui contains `postinstall.sh` script and the since it will be
    # executed in a docker container with root privileges we need the
    # --unsafe-perm flag.
    docker exec $CID bash -c 'cd fabric8-ui; npm install --unsafe-perm'
    docker exec $CID bash -c 'cd fabric8-ui && npm install ../*0.0.0-development.tgz'
    docker exec $CID bash -c '''
        export FABRIC8_WIT_API_URL="https://api.prod-preview.openshift.io/api/"
        export FABRIC8_RECOMMENDER_API_URL="https://recommender.prod-preview.api.openshift.io"
        export FABRIC8_FORGE_API_URL="https://forge.api.prod-preview.openshift.io"
        export FABRIC8_SSO_API_URL="https://sso.prod-preview.openshift.io/"
        export FABRIC8_AUTH_API_URL="https://auth.prod-preview.openshift.io/api/"

        export OPENSHIFT_CONSOLE_URL="https://console.free-stg.openshift.com/console/"
        export WS_K8S_API_SERVER="f8osoproxy-test-dsaas-preview.b6ff.rh-idev.openshiftapps.com:443"
        export FABRIC8_FEATURE_TOGGLES_API_URL="f8osoproxy-test-dsaas-preview.b6ff.rh-idev.openshiftapps.com:443" 

        export PROXIED_K8S_API_SERVER="${WS_K8S_API_SERVER}"
        export OAUTH_ISSUER="https://${WS_K8S_API_SERVER}"
        export PROXY_PASS_URL="https://${WS_K8S_API_SERVER}"
        export OAUTH_AUTHORIZE_URI="https://${WS_K8S_API_SERVER}/oauth/authorize"
        export AUTH_LOGOUT_URI="https://${WS_K8S_API_SERVER}/connect/endsession?id_token={{id_token}}"

        cd fabric8-ui && npm run build:prod
    '''
    # Copy dist and Dockerfile.deploy to host (via mounted dir)
    docker exec $CID bash -c 'cd fabric8-ui; cp -r dist/ /home/fabric8/fabric8-planner/fabric8-ui-dist/'
    docker exec $CID bash -c 'cd fabric8-ui; cp Dockerfile.deploy /home/fabric8/fabric8-planner/fabric8-ui-dist'
}

function build_test_and_push_image() {
    REGISTRY="quay.io"
    TAG="SNAPSHOT-PR-${ghprbPullId}"
    IMAGE_REPO="openshiftio/fabric8-ui-fabric8-planner"

    current_directory=$(pwd)
    cd fabric8-ui-dist

    docker build -t fabric8-planner-snapshot -f Dockerfile.deploy .

    run_functional_tests;

    push_image;

    show_docker_command;
    cd $current_directory
}

function push_image() {
    # login first
    if [ -n "${QUAY_USERNAME}" -a -n "${QUAY_PASSWORD}" ]; then
        docker login -u ${QUAY_USERNAME} -p ${QUAY_PASSWORD} ${REGISTRY}
    else
        echo "Could not login, missing credentials for the registry"
        exit 1
    fi
    docker tag fabric8-planner-snapshot ${REGISTRY}/${IMAGE_REPO}:$TAG
    docker push ${REGISTRY}/${IMAGE_REPO}:${TAG}
}

function show_docker_command() {
    PULL_REGISTRY="quay.io"
    image_name="${PULL_REGISTRY}/${IMAGE_REPO}:${TAG}"
    # turn off showing command before executing
    set +x
    # Pretty print the command for snapshot
    echo
    echo -e "\e[92m========= Run snapshot by running following command ================\e[0m"
    echo -e "\e[92m\e[1mdocker pull ${image_name} && docker run -it -p 5000:8080 ${image_name}\e[0m"
    echo -e "\e[92m====================================================================\e[0m"

    # Show command before executing
    set -x
}
