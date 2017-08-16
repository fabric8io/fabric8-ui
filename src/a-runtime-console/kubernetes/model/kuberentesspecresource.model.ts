import {KubernetesResource} from './kubernetesresource.model';

export class KubernetesSpecResource extends KubernetesResource {
  spec: any;
  status: any;

  updateResource(resource) {
    resource.spec = this.spec;
    delete resource.status;
    super.updateResource(resource);
  }

  updateValuesFromResource() {
    super.updateValuesFromResource();
    this.spec = this.resource.spec || {};
    this.status = this.resource.status || {};
  }
}
