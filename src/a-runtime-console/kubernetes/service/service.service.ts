import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { Service, Services } from '../model/service.model';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespaceScope } from './namespace.scope';
import { NamespacedResourceService } from './namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';


@Injectable()
export class ServiceService extends NamespacedResourceService<Service, Services> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/services', watcherFactory);
  }
}
