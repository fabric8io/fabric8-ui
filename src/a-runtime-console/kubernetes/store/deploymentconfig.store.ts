import { Injectable } from '@angular/core';
import { NamespacedResourceStore } from './namespacedresource.store';
import { NamespaceScope } from '../service/namespace.scope';
import { DeploymentConfig, DeploymentConfigs } from '../model/deploymentconfig.model';
import { DeploymentConfigService } from '../service/deploymentconfig.service';

@Injectable()
export class DeploymentConfigStore extends NamespacedResourceStore<DeploymentConfig, DeploymentConfigs, DeploymentConfigService> {
  constructor(deploymentService: DeploymentConfigService, namespaceScope: NamespaceScope) {
    super(deploymentService, [], <DeploymentConfig> {}, namespaceScope, DeploymentConfig);
  }

  protected get kind() {
    return 'DeploymentConfig';
  }
}
