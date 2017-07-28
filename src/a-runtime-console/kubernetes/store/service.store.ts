import {Service, Services} from '../model/service.model';
import {ServiceService} from '../service/service.service';
import {Injectable} from '@angular/core';
import {NamespacedResourceStore} from './namespacedresource.store';
import {NamespaceScope} from '../service/namespace.scope';

@Injectable()
export class ServiceStore extends NamespacedResourceStore<Service, Services, ServiceService> {
  constructor(serviceService: ServiceService, namespaceScope: NamespaceScope) {
    super(serviceService, [], <Service>{}, namespaceScope, Service);
  }

  protected get kind() {
    return 'Service';
  }
}
