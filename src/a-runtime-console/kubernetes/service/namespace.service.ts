import { WatcherFactory } from './watcher-factory.service';
import { Inject, Injectable } from '@angular/core';
import { Restangular } from 'ng2-restangular';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { KubernetesService } from './kubernetes.service';
import { Namespace, Namespaces } from '../model/namespace.model';
import { isOpenShift } from '../store/apis.store';

var namespacesUrl = '/api/v1/namespaces';
var projectsUrl = '/oapi/v1/projects';

function namespaceOrProjectsUrl() {
  if (isOpenShift()) {
    return projectsUrl;
  }
  return namespacesUrl;
}

@Injectable()
export class NamespaceService extends KubernetesService<Namespace, Namespaces> {

  constructor(@Inject(KUBERNETES_RESTANGULAR) kubernetesRestangular: Restangular, watcherFactory: WatcherFactory) {
    super(kubernetesRestangular.service(namespaceOrProjectsUrl()), watcherFactory);
  }

  get serviceUrl(): string {
    return namespaceOrProjectsUrl();
  }
}

