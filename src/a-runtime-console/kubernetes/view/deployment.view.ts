import { Service, Services } from "../model/service.model";
import { Deployment, Deployments } from "../model/deployment.model";
import { DeploymentConfigs, DeploymentConfig } from "../model/deploymentconfig.model";


export class DeploymentView {
  public readonly deployment: Deployment;
  public readonly service: Service;
  public readonly id: string;
  public readonly name: string;
  public readonly namespace: string;
  public readonly version: string;
  public readonly icon: string;
  public readonly description: string;
  public readonly exposeUrl: string;
  public readonly replicas: number;
  public readonly statusReplicas: number;
  public readonly availableReplicas: number;
  public readonly unavailableReplicas: number;
  public readonly updatedReplicas: number;

  /**
   * How many replicas are terminating?
   */
  public readonly terminatingReplicas: number;

  /**
   * How many replicas are starting up?
   */
  public readonly startingReplicas: number;

  /**
   * If there are no running, starting or terminating pods
   */
  public readonly emptyReplicas: boolean;
  public readonly labels: Map<string, string>;
  public readonly images: Array<String>;
  public readonly annotations: Map<string, string>;
  public readonly creationTimestamp: any;

  constructor(deployment: Deployment, service: Service) {
    this.deployment = deployment;
    this.service = service;
    this.id = deployment.id;
    this.name = deployment.name;
    this.namespace = deployment.namespace;
    this.icon = deployment.icon;
    this.description = deployment.description;
    this.labels = deployment.labels;
    this.annotations = deployment.annotations;
    this.creationTimestamp = deployment.creationTimestamp;
    if (service) {
      this.exposeUrl = service.exposeUrl;
    }
    this.images = new Array<String>();
    let spec = deployment.spec;
    if (spec) {
      let template = spec.template;
      if (template) {
        let podSpec = template.spec;
        if (podSpec) {
          let containers = podSpec.containers;
          if (containers) {
            containers.forEach((c) => {
              let image = c.image;
              if (image) {
                this.images.push(image);
              }
            });
          }
        }
      }
    }
    this.replicas = deployment.replicas;
    this.statusReplicas = deployment.statusReplicas;
    this.availableReplicas = deployment.availableReplicas;
    this.unavailableReplicas = deployment.unavailableReplicas;
    this.updatedReplicas = deployment.updatedReplicas;
    this.startingReplicas = deployment.startingReplicas;
    this.terminatingReplicas = deployment.terminatingReplicas;
    this.emptyReplicas = deployment.emptyReplicas;
    this.version = deployment.version;
  }

  defaultKind() {
    const deployment = this.deployment;
    return deployment ? deployment.defaultKind() : "";
  }
}

export class DeploymentViews extends Array<DeploymentView> {
}

/**
 * Combines Deployments and DeploymentConfigs into a list removing any duplicates
 */
export function combineDeployments(deployments: Deployments, deploymentConfigs: DeploymentConfigs): Deployments {
  let map = {};
  if (deployments) {
    deployments.forEach(s => map[s.name] = s);
  }

  var answer = new Deployments();
  deployments.forEach((d) => answer.push(d));
  if (deploymentConfigs) {
    deploymentConfigs.forEach((dc) => {
      var name = dc.name;
      if (name && !map[name]) {
        answer.push(dc)
      }
    });
  }
  return answer;
}

/**
 * Combines Deployments and DeploymentConfigs into a list removing any duplicates
 */
export function combineDeployment(deployment: Deployment, deploymentConfig: DeploymentConfig): Deployment {
  if (deployment && deployment.resource) {
    return deploymentConfig && deploymentConfig.resource ? deploymentConfig : deployment;
  } else {
    return deploymentConfig;
  }
}

export function createDeploymentViews(deployments: Deployments, services: Services): DeploymentViews {
  let map = {};
  services.forEach(s => map[s.name] = s);
  return deployments.map(d => new DeploymentView(d, map[d.name]));
}
