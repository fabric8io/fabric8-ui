import { Injectable } from '@angular/core';
import { Service, Services } from '../model/service.model';
import { NamespaceScope } from '../service/namespace.scope';
import { ServiceService } from '../service/service.service';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class ServiceStore extends NamespacedResourceStore<Service, Services, ServiceService> {
  constructor(serviceService: ServiceService, namespaceScope: NamespaceScope) {
    super(serviceService, [], <Service> {}, namespaceScope, Service);
  }

  protected get kind() {
    return 'Service';
  }
}
