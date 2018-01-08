import { Injectable } from '@angular/core';
import { DeploymentConfig, DeploymentConfigs } from '../model/deploymentconfig.model';
import { DeploymentConfigService } from '../service/deploymentconfig.service';
import { NamespaceScope } from '../service/namespace.scope';
import { NamespacedResourceStore } from './namespacedresource.store';

@Injectable()
export class DeploymentConfigStore extends NamespacedResourceStore<DeploymentConfig, DeploymentConfigs, DeploymentConfigService> {
  constructor(deploymentService: DeploymentConfigService, namespaceScope: NamespaceScope) {
    super(deploymentService, [], <DeploymentConfig> {}, namespaceScope, DeploymentConfig);
  }

  protected get kind() {
    return 'DeploymentConfig';
  }
}
