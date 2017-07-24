import { Observable } from 'rxjs';

export const errorForExecuteForgeCommandError = {
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

export const expectedForgeError = {
  "origin": "Fabric8AppGeneratorService",
  "name": "ExecuteForgeCommandError",
  "message": "The forge-quick-start :: begin :: 0 command failed or only partially succeeded",
  "inner": {
    "status": "FAILED",
    "message": "Failed to find Jenkins URL: io.fabric8.kubernetes.client.KubernetesClientException: Failure executing: GET at: https://api.starter-us-east-2.openshift.com/apis/extensions/v1beta1/namespaces/aslak/ingresses. Message: Forbidden!Configured service account doesn't have access."
  }
};

export const mockServiceForError = {
  executeCommand(options) {
    return Observable.create(observer => {
      observer.error(errorForExecuteForgeCommandError);
      observer.complete();
    })
  }
}

export const errorForForgeException = {
  "origin": "Fabric8ForgeService",
  "name": "ForgeApiClientExceptionError",
  "message": "An unexpected error occurred while consuming the http response returned from the server",
  "inner": {
    "_body": "{\"type\":\"org.javassist.tmp.java.lang.RuntimeException_$$_javassist_60aecd8a-a516-4262-8fd3-0aaf82659a25\",\"message\":\"Failed to find Jenkins URL in namespaces ckrych-jenkins and ckrych-jenkins: \",\"localizedMessage\":\"Failed to find Jenkins URL in namespaces ckrych-jenkins and ckrych-jenkins: \",\"forgeVersion\":\"3.6.1.Final\",\"stackTrace\":[{\"line\":303,\"class\":\"io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep\",\"file\":\"CreateBuildConfigStep.java\",\"method\":\"execute\"},{\"line\":-2,\"class\":\"sun.reflect.NativeMethodAccessorImpl\",\"file\":\"NativeMethodAccessorImpl.java\",\"method\":\"invoke0\"}]}",
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

export const mockServiceForgeException = {
  executeCommand(options) {
    return Observable.create(observer => {
      observer.error(errorForForgeException);
      observer.complete();
    })
  }
};

export const expectedForException = {
  "origin": "Fabric8AppGeneratorService",
  "name": "ExecuteForgeCommandError",
  "message": "The forge-quick-start :: begin :: 0 command failed or only partially succeeded",
  "inner": {
    "type": "org.javassist.tmp.java.lang.RuntimeException_$$_javassist_60aecd8a-a516-4262-8fd3-0aaf82659a25",
    "message": "Failed to find Jenkins URL in namespaces ckrych-jenkins and ckrych-jenkins: ",
    "localizedMessage": "Failed to find Jenkins URL in namespaces ckrych-jenkins and ckrych-jenkins: ",
    "forgeVersion": "3.6.1.Final",
    "stackTrace": [
      {
        "line": 303,
        "class": "io.fabric8.forge.generator.kubernetes.CreateBuildConfigStep",
        "file": "CreateBuildConfigStep.java",
        "method": "execute"
      },
      {
        "line": -2,
        "class": "sun.reflect.NativeMethodAccessorImpl",
        "file": "NativeMethodAccessorImpl.java",
        "method": "invoke0"
      }
    ]
  }
};
