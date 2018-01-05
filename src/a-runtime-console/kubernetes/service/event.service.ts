import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { Events, Event } from '../model/event.model';
import { NamespacedResourceService } from './namespaced.resource.service';
import { NamespaceScope } from './namespace.scope';

@Injectable()
export class EventService extends NamespacedResourceService<Event, Events> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/events', watcherFactory);
  }
}
