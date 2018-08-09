import { Observable } from 'rxjs';

import { Restangular } from 'ngx-restangular';

import { RESTService } from '../../store/entity/rest.service';
import { KubernetesResource } from '../model/kubernetesresource.model';
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

    return this.restangularService.all(this.serviceUrl).post(resource);
  }

  update(obj: T): Observable<T> {
    let resource = obj.resource;
    obj.updateResource(resource);
    return this.updateResource(obj, resource);
  }

  updateResource(obj: T, resource: any) {
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
