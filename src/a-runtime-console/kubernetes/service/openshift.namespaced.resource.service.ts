import { WatcherFactory } from './watcher-factory.service';
import { Restangular } from 'ng2-restangular';
import { KubernetesResource } from '../model/kubernetesresource.model';
import { NamespaceScope } from './namespace.scope';
import { NamespacedResourceService } from './namespaced.resource.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { isOpenShift } from '../store/apis.store';
import { Watcher } from './watcher';


export abstract class OpenShiftNamespacedResourceService<T extends KubernetesResource, L extends Array<T>> extends NamespacedResourceService<T, L> {
  constructor(kubernetesRestangular: Restangular,
    namespaceScope: NamespaceScope,
    urlSuffix: string, watcherFactory: WatcherFactory, urlPrefix: string = '/oapi/v1/namespaces') {
    super(kubernetesRestangular, namespaceScope, urlSuffix, watcherFactory, urlPrefix);
  }

  get(id: string, namespace: string = null): Observable<T> {
    if (!isOpenShift()) {
      return new BehaviorSubject(null);
    }
    return super.get(id, namespace);
  }

  list(namespace: string = null, queryParams: any = null): Observable<L> {
    if (!isOpenShift()) {
      return new BehaviorSubject(null);
    }
    return super.list(namespace, queryParams);
  }

  watch(queryParams: any = null): Watcher<L> {
    // lets return a watcher with no URL to avoid websockets
    let listFactory = () => this.list(queryParams);
    return this.watcherFactory.newInstance(() => null, queryParams, listFactory);
  }

  create(obj: T): Observable<T> {
    if (!isOpenShift()) {
      throw this.createUnsupportedResourceError();
    }
    return super.create(obj);
  }

  update(obj: T): Observable<T> {
    if (!isOpenShift()) {
      throw this.createUnsupportedResourceError();
    }
    return super.update(obj);
  }

  delete(obj: T): any {
    if (!isOpenShift()) {
      throw this.createUnsupportedResourceError();
    }
    return super.delete(obj);
  }

  protected createUnsupportedResourceError() {
    return new Error('Unsupported resource kind when not running on OpenShift');
  }

}
