import { Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { Restangular } from 'ng2-restangular';

import { RESTService } from '../../store/entity/rest.service';
import { KUBERNETES_RESTANGULAR } from './kubernetes.restangular';
import { KubernetesResource } from '../model/kubernetesresource.model';
import { Watcher } from './watcher';
import { WatcherFactory } from './watcher-factory.service';

export abstract class KubernetesService<T extends KubernetesResource, L extends Array<T>> extends RESTService<T, L> {

  constructor(
    kubernetesRestangular: Restangular,
    public watcherFactory: WatcherFactory
  ) {
    super(kubernetesRestangular);
  }

  /**
   * Creates a watcher that can watch for events
   * @param queryParams
   */
  watch(queryParams: any = null) {
    let poller = () => this.list(queryParams);
    return this.watcherFactory.newInstance(() => this.serviceUrl, queryParams, poller);
  }

  get(id: string): Observable<T> {
    return super.get(id);
  }

  create(obj: T): Observable<T> {
    let resource = obj.resource || {};
    if (!resource.kind) {
      resource.kind = obj.defaultKind();
    }
    obj.updateResource(resource);
    console.log('Creating resource with value ' + JSON.stringify(resource, null, '  '));

    return this.restangularService.all(this.serviceUrl).post(resource);
  }

  update(obj: T): Observable<T> {
    let resource = obj.resource;
    obj.updateResource(resource);
    return this.updateResource(obj, resource);
  }

  updateResource(obj: T, resource: any) {
    let id = obj.id;
    console.log('Updating key ' + id + ' with value ' + JSON.stringify(resource, null, '  '));
    let resty: any = obj;
    return resty.customPUT(resource);
  }

  delete(obj: T): any {
    let resty: any = obj;
    return resty.customDELETE();
  }

  defaultKind() {
    return 'Service';
  }

  abstract get serviceUrl(): string
}
