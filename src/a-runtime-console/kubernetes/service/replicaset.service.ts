import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { ReplicaSet, ReplicaSets } from '../model/replicaset.model';
import { NamespacedResourceService } from './namespaced.resource.service';
import { NamespaceScope } from './namespace.scope';
import { apisExtensionsNamespacesUrl } from './deployment.service';

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
