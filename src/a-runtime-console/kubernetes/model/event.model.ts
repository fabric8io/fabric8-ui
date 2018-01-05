import { KubernetesResource } from './kubernetesresource.model';

export class Event extends KubernetesResource {

  defaultKind() {
    return 'Event';
  }
}

export class Events extends Array<Event>{
}
