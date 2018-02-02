

import { DeploymentView, DeploymentViews } from '../view/deployment.view';
import { Environment, Space } from './space.model';


import { currentOAuthConfig } from '../store/oauth-config-store';
import { pathJoin } from './utils';

export class EnvironmentDeployments {
  openshiftConsoleUrl: string;

  constructor(public environment: Environment, public deployments: DeploymentViews) {
    this.openshiftConsoleUrl = environmentOpenShiftConsoleUrl(environment);
  }
}
export class AppDeployments {
  name: string;
  icon: string;
  environmentDetails: AppEnvironmentDetails[] = [];

  constructor(envCount: number) {
    for (let i = 0; i < envCount; i++) {
      this.environmentDetails.push(new AppEnvironmentDetails());
    }
  }

  addDeployment(envNameToIndexMap: Map<string, number>, environment: Environment, deployment: DeploymentView) {
    if (!this.name) {
      this.name = deployment.name;
    }
    if (!this.icon) {
      this.icon = deployment.icon;
    }
    let key = environment.key;
    if (key) {
      let idx = envNameToIndexMap[key];
      if (idx) {
        idx--;
        var envInfo = this.environmentDetails[idx];
        if (!envInfo) {
          envInfo = new AppEnvironmentDetails();
          this.environmentDetails[idx] = envInfo;
        }
        envInfo.addDeployment(this, environment, deployment);
      }
    }
  }
}

export class AppEnvironmentDetails {
  environment: Environment;
  deployment: DeploymentView;
  version: string;
  environmentName: string;
  exposeUrl: string;

  addDeployment(appDeployments: AppDeployments, environment: Environment, deployment: DeploymentView) {
    this.environment = environment;
    this.deployment = deployment;
    this.version = deployment.version;
    this.environmentName = environment.name;

    // lets only show the service URL if there are available pods
    if (deployment.availableReplicas) {
      this.exposeUrl = deployment.exposeUrl;
    } else {
      this.exposeUrl = '';
    }
  }
}

export function environmentOpenShiftConsoleUrl(environment: Environment): string {
  let openshiftConsoleUrl = process.env.OPENSHIFT_CONSOLE_URL;
  if (!openshiftConsoleUrl) {
    let config = currentOAuthConfig();
    if (config != undefined) {
      openshiftConsoleUrl = config.openshiftConsoleUrl;
    }
  }
  let namespace = environment.namespaceName;
  if (namespace) {
    return pathJoin(openshiftConsoleUrl, '/project', namespace, '/overview');
  }
  return openshiftConsoleUrl;
}
