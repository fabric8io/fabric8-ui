import { KubernetesSpecResource } from './kuberentesspecresource.model';

export class Pod extends KubernetesSpecResource {
  public images: Array<string>;

  public phase: string;

  public setResource(resource) {
    const answer = super.setResource(resource);
    this.images = [];
    const spec = this.spec;
    if (spec) {
      const containers = spec.containers;
      if (containers) {
        containers.forEach((c) => {
          const image = c.image;
          if (image) {
            this.images.push(image);
          }
        });
      }
    }
    const metadata = resource.metadata || {};
    if (metadata.deletionTimestamp) {
      this.phase = 'Terminating';
    } else {
      const status = this.status;
      if (status) {
        this.phase = status.phase;
        const containerStatuses = status.containerStatuses;
        if (containerStatuses && containerStatuses.length) {
          let ready = true;
          for (const cs of containerStatuses) {
            if (!cs.ready) {
              ready = false;
              break;
            }
          }
          if (ready) {
            this.phase = 'Ready';
          }
        }
      }
    }
    return answer;
  }

  defaultKind() {
    return 'Pod';
  }
}

export class Pods extends Array<Pod> {}
