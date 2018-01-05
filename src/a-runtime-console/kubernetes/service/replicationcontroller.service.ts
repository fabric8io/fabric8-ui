import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { ReplicationController, ReplicationControllers } from '../model/replicationcontroller.model';
import { NamespacedResourceService } from './namespaced.resource.service';
import { NamespaceScope } from './namespace.scope';

@Injectable()
export class ReplicationControllerService extends NamespacedResourceService<ReplicationController, ReplicationControllers> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/replicationcontrollers', watcherFactory);
  }
}
