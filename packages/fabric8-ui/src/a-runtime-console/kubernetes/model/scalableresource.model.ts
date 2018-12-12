import { KubernetesSpecResource } from './kuberentesspecresource.model';

export class ScalableResource extends KubernetesSpecResource {
  replicas: number;
  availableReplicas: number;
  unavailableReplicas: number;
  updatedReplicas: number;
  statusReplicas: number;

  /**
   * How many replicas are terminating?
   */
  public terminatingReplicas: number;

  /**
   * How many replicas are starting up?
   */
  public startingReplicas: number;

  /**
   * If there are no running, starting or terminating pods
   */
  public emptyReplicas: boolean;


  updateResource(resource) {
    resource.spec = this.spec;
    resource.spec.replicas = this.replicas;
    super.updateResource(resource);
  }

  updateValuesFromResource() {
    super.updateValuesFromResource();
    this.replicas = this.resource.spec.replicas || 0;
    this.availableReplicas = 0;
    this.unavailableReplicas = 0;
    this.updatedReplicas = 0;
    this.statusReplicas = 0;
    let status = this.status;
    if (status) {
      this.availableReplicas = status.availableReplicas || 0;
      this.unavailableReplicas = status.unavailableReplicas || 0;
      this.updatedReplicas = status.updatedReplicas || 0;
      this.statusReplicas = status.replicas || 0;
    }

    this.terminatingReplicas = this.availableReplicas - this.replicas;
    if (this.terminatingReplicas < 0) {
      this.terminatingReplicas = 0;
    }
    this.startingReplicas = this.replicas - this.availableReplicas;
    if (this.startingReplicas < 0) {
      this.startingReplicas = 0;
    }
    this.emptyReplicas = !(this.availableReplicas || this.startingReplicas || this.terminatingReplicas);
  }
}
