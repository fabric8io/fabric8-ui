import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { ReplicaSet, ReplicaSets } from '../model/replicaset.model';
import { apisExtensionsNamespacesUrl } from './deployment.service';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespaceScope } from './namespace.scope';
import { NamespacedResourceService } from './namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';

@Injectable()
export class ReplicaSetService extends NamespacedResourceService<ReplicaSet, ReplicaSets> {
  constructor(
    @Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular,
    namespaceScope: NamespaceScope,
    watcherFactory: WatcherFactory
  ) {
    super(kubernetesRestangular, namespaceScope, '/replicasets', watcherFactory, apisExtensionsNamespacesUrl);
  }
}
