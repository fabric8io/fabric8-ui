## Delete/cleanup OpenShift assets

oc login https://api.starter-us-east-2.openshift.com --token=$1

oc delete bc --all -n almusertest1
oc delete build --all -n almusertest1
oc delete build --all -n almusertest1-test
oc delete build --all -n almusertest1-stage
oc delete build --all -n almusertest1-run

## Delete/cleanup Jenkins jobs - commented out for now - until test can run more reliably
##
## export TOKEN=`docker exec fabric8-ui-builder cat ../.kube/config | grep token | sed -e 's/token://g' |  sed -e 's/ //g'`
## export ID=`docker exec fabric8-ui-builder openshift-origin-client-tools-v1.5.0-031cbe4-linux-64bit/oc whoami`
## export GITID=almightytest
##
## curl  -d "json=%7B%7D&Submit=Yes"  -X POST -H "Authorization: Bearer ${TOKEN}" -H "Referer: https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/delete" -H "Content-Type: application/x-www-form-urlencoded" https://jenkins-${ID}-jenkins.8a09.starter-us-east-2.openshiftapps.com/job/${GITID}/doDelete






