import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { Deployment, Deployments } from '../model/deployment.model';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { NamespaceScope } from './namespace.scope';
import { NamespacedResourceService } from './namespaced.resource.service';
import { WatcherFactory } from './watcher-factory.service';

export const apisExtensionsNamespacesUrl = '/apis/extensions/v1beta1/namespaces/';

@Injectable()
export class DeploymentService extends NamespacedResourceService<Deployment, Deployments> {
  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, namespaceScope: NamespaceScope, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular, namespaceScope, '/deployments', watcherFactory, apisExtensionsNamespacesUrl);
  }
}
