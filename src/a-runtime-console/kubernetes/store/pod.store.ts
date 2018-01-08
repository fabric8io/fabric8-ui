import { Injectable } from '@angular/core';
import { Pod, Pods } from '../model/pod.model';
import { NamespaceScope } from '../service/namespace.scope';
import { PodService } from '../service/pod.service';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class PodStore extends NamespacedResourceStore<Pod, Pods, PodService> {
  constructor(podPod: PodService, namespaceScope: NamespaceScope) {
    super(podPod, [], <Pod> {}, namespaceScope, Pod);
  }

  protected get kind() {
    return 'Pod';
  }
}
