import { KubernetesSpecResource } from './kuberentesspecresource.model';

export class Route extends KubernetesSpecResource {
  host: string;

  updateValuesFromResource() {
    super.updateValuesFromResource();
    this.host = this.spec.host || '';
  }
}

export class Routes extends Array<Route>{
}
