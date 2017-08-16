import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { Pods, Pod } from '../model/pod.model';
import { NamespacedResourceService } from './namespaced.resource.service';
import { NamespaceScope } from './namespace.scope';


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
