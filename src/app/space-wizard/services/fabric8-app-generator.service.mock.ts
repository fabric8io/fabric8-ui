import { Observable } from 'rxjs';

export let errorForExecuteForgeCommandError = {
  "origin": "Fabric8ForgeService",
  "name": "ForgeApiClientExceptionError",
  "message": "An unexpected error occurred while consuming the http response returned from the server",
  "inner": {
    "_body": "{\"results\":[{\"status\":\"SUCCESS\"},{\"status\":\"SUCCESS\",\"message\":\"Added Jenkinsfile to project\"},{\"status\":\"SUCCESS\",\"message\":\"Created git repository: https://github.com/corinnekrych/testbrrr\"},{\"status\":\"FAILED\",\"message\":\"Failed to find Jenkins URL: io.fabric8.kubernetes.client.KubernetesClientException: Failure executing: GET at: https://api.starter-us-east-2.openshift.com/apis/extensions/v1beta1/namespaces/aslak/ingresses. Message: Forbidden!Configured service account doesn't have access.\"}]}",
    "status": 500,
    "ok": false,
    "statusText": "Internal Server Error",
    "headers": {
      "Content-Type": [
        "application/json"
      ]
    },
    "type": 2,
    "url": "http://localhost:8080/forge/commands/fabric8-new-project/execute",
    "inner": {}
  }
};

export let expectedErr = {
  "origin": "Fabric8AppGeneratorService",
  "name": "ExecuteForgeCommandError",
  "message": "The forge-quick-start :: begin :: 0 command failed or only partially succeeded",
  "inner": {
    "status": "FAILED",
    "message": "Failed to find Jenkins URL: io.fabric8.kubernetes.client.KubernetesClientException: Failure executing: GET at: https://api.starter-us-east-2.openshift.com/apis/extensions/v1beta1/namespaces/aslak/ingresses. Message: Forbidden!Configured service account doesn't have access."
  }
};

export let mockService = {
  executeCommand(options) {
    return Observable.create(observer => {
      observer.error(errorForExecuteForgeCommandError);
      observer.complete();
    })
  }
}
