import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { Pod, Pods } from '../model/pod.model';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespaceScope } from './namespace.scope';
import { NamespacedResourceService } from './namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';


@Injectable()
export class PodService extends NamespacedResourceService<Pod, Pods> {
  constructor(
    @Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular,
    namespaceScope: NamespaceScope,
    watcherFactory: WatcherFactory
  ) {
    super(kubernetesRestangular, namespaceScope, '/pods', watcherFactory);
  }
}
