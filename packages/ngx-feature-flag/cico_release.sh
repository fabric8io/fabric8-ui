#!/bin/bash
# Show command before executing
set -x

# Exit on error
set -e

# This option sets the exit code of a pipeline to that of the rightmost command to exit with a
# non-zero status, or to zero if all commands of the pipeline exit successfully.
set -o pipefail

function release() {
    # add .npmrc file to give permissions
    echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > ~/.npmrc

    npm whoami

    # Enable verbose output
    npm config set loglevel verbose

    # Set the branch as it defaults to the branch 'origin/master'
    git checkout master
    export GIT_BRANCH=master


    # check where we are
    git branch -va
    git remote -v

    # Build and Release
    npm run semantic-release

    # create_merge_PR
}

# This function raises a PR against fabric8-npm-dependencies
function create_merge_PR {
    # Fetch latest tags
    git pull --tags origin master
    # extract version number from latest git tag
    new_version=$(git tag --sort=-v:refname | head -1 | cut -d'v' -f 2)

    # Create PR on fabric8-npm-dependencies and merge it
    repo="fabric8-npm-dependencies"
    org="fabric8-ui"
    project="${org}/${repo}"
    baseUrl="https://api.github.com/repos"
    id=$(uuidgen)
    git clone "https://github.com/${project}.git"
    cd ${repo} && git checkout -b versionUpdate"${id}"

    # find fabric8-planner > extract version number > remove ", char > trim whitespacs
    current_version=$( grep ngx-feature-flag package.json \
        | awk -F: '{ print $2 }' \
        | sed 's/[",]//g' \
        | tr -d '[:space:]' )
    echo "New Feature-Flag version:" new_version
    echo "Current Feature-Flag version:" $current_version
    if [ "new_version" == "$current_version" ]; then
        echo "Skippping as ngx-feature-flag is already on version new_version"
        exit 0
    fi

    git config --global user.email fabric8cd@gmail.com
    git config --global user.name fabric8-cd
    # Set authentication credentials to allow "git push"
    git remote set-url origin https://fabric8cd:${GH_TOKEN}@github.com/${project}.git

    message="fix(version): update package.json ngx-feature-flag to ${new_version}"
    updatePackageJSONVersion "$new_version"
    git add package.json
    git commit -m "${message}"
    git push origin versionUpdate"${id}"
    local body="{
        \"title\": \"${message}\",
        \"head\": \"versionUpdate${id}\",
        \"base\": \"master\"
        }"

    apiUrl="${baseUrl}/${project}/pulls"
    echo "Creating PR for ${apiUrl}"
    PR_id=$(curl --silent -X POST -H "Authorization: Bearer $GH_TOKEN" -d "${body}" "${apiUrl}" \
            | sed -n 's/.*"number": \(.*\),/\1/p' )
    echo "Received PR id: ${PR_id}"

    # Wait for all CI checks on PR to be successful
    waitUntilSuccess "${PR_id}" "${project}"

    # Merge PR
    apiUrl="${baseUrl}/${project}/pulls/${PR_id}/merge"
    echo "Merging PR ${PR_id}"
    curl --silent -X PUT -H "Authorization: Bearer $GH_TOKEN" "${apiUrl}"
}

# Updates ngx-launcher's version in package.json file
function updatePackageJSONVersion {
    local f="package.json"
    local p="ngx-feature-flag"
    local v=$1
    sed -i -r "s/\"${p}\": \"[0-9][0-9]{0,2}.[0-9][0-9]{0,2}(.[0-9][0-9]{0,2})?(.[0-9][0-9]{0,2})?(-development)?\"/\"${p}\": \"${v}\"/g" ${f}
}

# Wait for all CI checks to pass
function waitUntilSuccess {
    pr_id=$1
    project=$2
    ref=$( curl --silent -X GET https://api.github.com/repos/"${project}"/pulls/"${pr_id}" \
           | sed -n 's/.*"ref": "\(.*\)",/\1/p' | head -1) # Extract "ref" value from the response
    status="NA"
    NEXT_WAIT_TIME=0
    # Max wait 720 seconds
    until [ "$status" == "success" ] || [ $NEXT_WAIT_TIME -eq 7 ]; do
        status=$( curl --silent -X GET https://api.github.com/repos/"${project}"/commits/"${ref}"/status \
                  | sed -n 's/.*"state": "\(.*\)",/\1/p')  # Extract "state" value from the response
        echo "Pull Request status: ${status}.  Waiting to merge..."
        sleep $(( NEXT_WAIT_TIME++ ))
    done
}
