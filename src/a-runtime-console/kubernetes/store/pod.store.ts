import {Injectable} from '@angular/core';
import {PodService} from '../service/pod.service';
import {Pod, Pods} from '../model/pod.model';
import {NamespacedResourceStore} from './namespacedresource.store';
import {NamespaceScope} from '../service/namespace.scope';

@Injectable()
export class PodStore extends NamespacedResourceStore<Pod, Pods, PodService> {
  constructor(podPod: PodService, namespaceScope: NamespaceScope) {
    super(podPod, [], <Pod>{}, namespaceScope, Pod);
  }

  protected get kind() {
    return 'Pod';
  }
}
