import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { DeploymentConfig, DeploymentConfigs } from '../model/deploymentconfig.model';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespaceScope } from './namespace.scope';
import { OpenShiftNamespacedResourceService } from './openshift.namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';

export const openshiftNamespacesUrl = '/oapi/v1/namespaces/';

@Injectable()
export class DeploymentConfigService extends OpenShiftNamespacedResourceService<DeploymentConfig, DeploymentConfigs> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/deploymentconfigs', watcherFactory, openshiftNamespacesUrl);
  }
}
