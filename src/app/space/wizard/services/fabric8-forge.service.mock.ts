export const expectedResponse = {
  '_body': '{"metadata":{"deprecated":false,"category":"Openshift.io","name":"Fabric8: New Project",' +
  '"description":"Generate your project from a booster"},"state":{"valid":false,"canExecute":false,"wizard":true,' +
  '"canMoveToNextStep":false,"canMoveToPreviousStep":false,"steps":["Fabric8: New Project"]},"inputs":' +
  '[{"name":"type","shortName":" ","valueType":"io.openshift.launchpad.catalog.Booster",' +
  '"inputType":"org.jboss.forge.inputType.DEFAULT","enabled":true,"required":true,"deprecated":false,' +
  '"label":"Booster","description":"A simple CRUD applicaiton using Wildfly Swarm","note":' +
  '"A simple CRUD applicaiton using Wildfly Swarm","valueChoices":[{"id":"HTTP CRUD - Wildfly Swarm",' +
  '"boosterDescriptionPath":".openshiftio/description.adoc","description":"A simple CRUD applicaiton using Wildfly Swarm",' +
  '"gitRef":"3","githubRepo":"wildfly-swarm-openshiftio-boosters/wfswarm-rest-http-crud","metadata":' +
  '{"name":"HTTP CRUD - Wildfly Swarm","description":"A simple CRUD applicaiton using Wildfly Swarm"},' +
  '"mission":"crud","name":"HTTP CRUD - Wildfly Swarm","runtime":"wildfly-swarm"},' +
  '{"id":"Secured Spring Boot Tomcat - HTTP & Red Hat SSO","boosterDescriptionPath":".openshiftio/description.adoc",' +
  '"description":"Application to expose a HTTP Greeting endpoint using SpringBoot & Secured by Red Hat SSO\n",' +
  '"gitRef":"v1","githubRepo":"snowdrop/spring-boot-http-secured-booster","metadata":' +
  '{"name":"Secured Spring Boot Tomcat - HTTP & Red Hat SSO"},"mission":"rest-http-secured",' +
  '"name":"Secured Spring Boot Tomcat - HTTP & Red Hat SSO","runtime":"spring-boot"},' +
  '{"id":"Secured Vertx - Rest & Red Hat SSO","boosterDescriptionPath":".openshiftio/description.adoc",' +
  '"description":"Quickstart to expose a REST Greeting endpoint using Eclipse Vert.x & Secured by Red Hat SSO",' +
  '"gitRef":"v4","githubRepo":"openshiftio-vertx-boosters/vertx-secured-http-booster","metadata":' +
  '{"name":"Secured Vertx - Rest & Red Hat SSO","description":"Quickstart to expose a REST Greeting endpoint using ' +
  'Eclipse Vert.x & Secured by Red Hat SSO"},"mission":"rest-http-secured","name":"Secured Vertx - Rest & Red Hat SSO",' +
  '"runtime":"vert.x"},{"id":"Spring Boot - CRUD","boosterDescriptionPath":".openshiftio/description.adoc",' +
  '"description":"Booster to expose an HTTP endpoint with CRUD operations on fruits database.","gitRef":"v5",' +
  '"githubRepo":"snowdrop/spring-boot-crud-booster","metadata":{"name":"Spring Boot - CRUD"},"mission":"crud",' +
  '"name":"Spring Boot - CRUD","runtime":"spring-boot"},{"id":"Spring Boot - ConfigMap","boosterDescriptionPath":' +
  '".openshiftio/description.adoc","description":"Booster to expose an HTTP Greeting endpoint using Spring Boot ' +
  'where the message is defined as a Kubernetes ConfigMap property","gitRef":"v4","githubRepo":' +
  '"snowdrop/spring-boot-configmap-booster","metadata":{"name":"Spring Boot - ConfigMap"},"mission":"configmap",' +
  '"name":"Spring Boot - ConfigMap","runtime":"spring-boot"},{"id":"Spring Boot - HTTP","boosterDescriptionPath":' +
  '".openshiftio/description.adoc","description":"Quickstart to expose a HTTP Greeting endpoint using Spring Boot ' +
  'and Apache Tomcat in embedded mode\n","gitRef":"v5","githubRepo":"snowdrop/spring-boot-http-booster","metadata":{"name":"Spring Boot - HTTP"},"mission":"rest-http","name":"Spring Boot - HTTP","runtime":"spring-boot"},{"id":"Spring Boot Circuit Breaker Example","boosterDescriptionPath":".openshiftio/description.adoc","description":"Quickstart to demonstrate Circuit Breaker pattern with Spring Boot.\n","gitRef":"v1","githubRepo":"snowdrop/spring-boot-circuit-breaker-booster","metadata":{"name":"Spring Boot Circuit Breaker Example"},"mission":"circuit-breaker","name":"Spring Boot Circuit Breaker Example","runtime":"spring-boot"},{"id":"Spring Boot Health Check Example","boosterDescriptionPath":".openshiftio/description.adoc","description":"Quickstart to demonstrate OpenShift health probes working with Spring Boot Actuator\n","gitRef":"v3","githubRepo":"snowdrop/spring-boot-health-check-booster","metadata":{"name":"Spring Boot Health Check Example"},"mission":"health-check","name":"Spring Boot Health Check Example","runtime":"spring-boot"},{"id":"Vert.x - HTTP & Config Map","boosterDescriptionPath":".openshiftio/description.adoc","description":"Simple HTTP endpoint where the Vert.x application uses OpenShift ConfigMap to get the application parameters.","gitRef":"v9","githubRepo":"openshiftio-vertx-boosters/vertx-configmap-booster","metadata":{"name":"Vert.x - HTTP & Config Map","description":"Simple HTTP endpoint where the Vert.x application uses OpenShift ConfigMap to get the application parameters."},"mission":"configmap","name":"Vert.x - HTTP & Config Map","runtime":"vert.x"},{"id":"Vert.x CRUD Example using JDBC","boosterDescriptionPath":".openshiftio/description.adoc","description":"Runs a Vert.x application exposing a HTTP endpoint proposing CRUD operations implemented on top of JDBC","gitRef":"v8","githubRepo":"openshiftio-vertx-boosters/vertx-crud-booster","metadata":{"name":"Vert.x CRUD Example using JDBC","description":"Runs a Vert.x application exposing a HTTP endpoint proposing CRUD operations implemented on top of JDBC"},"mission":"crud","name":"Vert.x CRUD Example using JDBC","runtime":"vert.x"},{"id":"Vert.x Circuit Breaker Booster","boosterDescriptionPath":".openshiftio/description.adoc","description":"Runs a Vert.x application using a circuit breaker","gitRef":"v2","githubRepo":"openshiftio-vertx-boosters/vertx-circuit-breaker-booster","metadata":{"name":"Vert.x Circuit Breaker Booster","description":"Runs a Vert.x application using a circuit breaker"},"mission":"circuit-breaker","name":"Vert.x Circuit Breaker Booster","runtime":"vert.x"},{"id":"Vert.x HTTP Booster","boosterDescriptionPath":".openshiftio/description.adoc","description":"Runs a Vert.x HTTP application","gitRef":"v7","githubRepo":"openshiftio-vertx-boosters/vertx-http-booster","metadata":{"name":"Vert.x HTTP Booster","description":"Runs a Vert.x HTTP application"},"mission":"rest-http","name":"Vert.x HTTP Booster","runtime":"vert.x"},{"id":"Vert.x Health Check Example","boosterDescriptionPath":".openshiftio/description.adoc","description":"Demonstrate health check and recovery mechanism","gitRef":"v5","githubRepo":"openshiftio-vertx-boosters/vertx-health-checks-booster","metadata":{"name":"Vert.x Health Check Example","description":"Demonstrate health check and recovery mechanism"},"mission":"health-check","name":"Vert.x Health Check Example","runtime":"vert.x"},{"id":"WildFly Swarm - Config Map","boosterDescriptionPath":".openshiftio/description.adoc","description":"Simple HTTP endpoint where the WildFly Swarm application uses OpenShift ConfigMap to retrieve application parameters.","gitRef":"5","githubRepo":"wildfly-swarm-openshiftio-boosters/wfswarm-configmap","metadata":{"name":"WildFly Swarm - Config Map","description":"Simple HTTP endpoint where the WildFly Swarm application uses OpenShift ConfigMap to retrieve application parameters."},"mission":"configmap","name":"WildFly Swarm - Config Map","runtime":"wildfly-swarm"},{"id":"WildFly Swarm - HTTP","boosterDescriptionPath":".openshiftio/description.adoc","description":"Runs a WildFly Swarm HTTP application","gitRef":"6","githubRepo":"wildfly-swarm-openshiftio-boosters/wfswarm-rest-http","metadata":{"name":"WildFly Swarm - HTTP","description":"Runs a WildFly Swarm HTTP application"},"mission":"rest-http","name":"WildFly Swarm - HTTP","runtime":"wildfly-swarm"},{"id":"WildFly Swarm - Health Checks","boosterDescriptionPath":".openshiftio/description.adoc","description":"Demonstrates Health Checks in Wildfly Swarm","gitRef":"4","githubRepo":"wildfly-swarm-openshiftio-boosters/wfswarm-health-check","metadata":{"name":"WildFly Swarm - Health Checks","description":"Demonstrates Health Checks in Wildfly Swarm"},"mission":"health-check","name":"WildFly Swarm - Health Checks","runtime":"wildfly-swarm"},{"id":"WildFly Swarm - REST and RH SSO","boosterDescriptionPath":".openshiftio/description.adoc","description":"A simple HTTP application using Wildfly Swarm secured by RH SSO","gitRef":"1","githubRepo":"wildfly-swarm-openshiftio-boosters/wfswarm-rest-http-secured","metadata":{"name":"WildFly Swarm - REST and RH SSO","description":"A simple HTTP application using Wildfly Swarm secured by RH SSO"},"mission":"rest-http-secured","name":"WildFly Swarm - REST and RH SSO","runtime":"wildfly-swarm"}],"class":"UISelectOne","value":"HTTP CRUD - Wildfly Swarm"},{"name":"named","shortName":" ","valueType":"java.lang.String","inputType":"org.jboss.forge.inputType.DEFAULT","enabled":true,"required":true,"deprecated":false,"label":"Project name","description":"The following characters are accepted: -a-z0-9 and the name cannot start or end with a dash","note":"Downloadable project zip and application jar are based on the project name","class":"UIInput","value":"demo"},{"name":"topLevelPackage","shortName":" ","valueType":"java.lang.String","inputType":"org.jboss.forge.inputType.DEFAULT","enabled":true,"required":true,"deprecated":false,"label":"Top level package","description":"The following characters are accepted: -_.a-zA-Z0-9","class":"UIInput","value":"com.example"},{"name":"version","shortName":" ","valueType":"java.lang.String","inputType":"org.jboss.forge.inputType.DEFAULT","enabled":true,"required":true,"deprecated":false,"label":"Project version","description":"","class":"UIInput","value":"1.0.0-SNAPSHOT"}]}',
  'status': 200,
  'ok': true,
  'statusText': 'OK',
  'headers': {
    'Content-Type': [
      'application/json'
    ]
  },
  'type': 2,
  'url': 'http://localhost:8080/forge/commands/fabric8-new-project'
};

export const expectedError = {
  '_body': {
    'type': 'java.lang.IllegalStateException',
    'message': 'Error while moving to the next wizard step',
    'localizedMessage': 'Error while moving to the next wizard step',
    'forgeVersion': '3.6.1.Final',
    'stackTrace': [{}],
    'cause': {
      'type': 'io.fabric8.forge.generator.keycloak.KeyCloakFailureException',
      'message':
        'KeyCloak failed to return a token for OpenShift o ' +
        'https://sso.openshift.io/auth/realms/fabric8/broker/openshift-v3/token',
      'localizedMessage':
        'KeyCloak failed to return a token for OpenShift on ' +
        'https://sso.openshift.io/auth/realms/fabric8/broker/openshift-v3/token',
      'forgeVersion': '3.6.1.Final',
      'stackTrace': []
    }
  },
  'status': 500,
  'ok': false,
  'statusText': 'Internal Server Error',
  'headers': {
    'Content-Type': [
      'application/json'
    ]
  },
  'type': 2,
  'url': 'http://localhost:8080/forge/commands/fabric8-new-project'
};
