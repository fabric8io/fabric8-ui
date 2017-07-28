import {Deployment} from "./deployment.model";

export class DeploymentConfig extends Deployment {
  defaultKind() {
    return 'DeploymentConfig';
  }
}

export class DeploymentConfigs extends Array<DeploymentConfig>{
}
