import { Injectable } from '@angular/core';
import { ConfigMap, ConfigMaps } from '../model/configmap.model';
import { ConfigMapService } from '../service/configmap.service';
import { NamespaceScope } from '../service/namespace.scope';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class ConfigMapStore extends NamespacedResourceStore<ConfigMap, ConfigMaps, ConfigMapService> {
  constructor(deploymentService: ConfigMapService, namespaceScope: NamespaceScope) {
    super(deploymentService, [], <ConfigMap> {}, namespaceScope, ConfigMap);
  }

  protected get kind() {
    return 'ConfigMap';
  }
}
