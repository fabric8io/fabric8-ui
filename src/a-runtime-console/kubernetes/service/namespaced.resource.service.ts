import { WatcherFactory } from './watcher-factory.service';
import { Restangular } from 'ng2-restangular';
import { KubernetesService } from './kubernetes.service';
import { Subscription, Observable } from 'rxjs';
import { KubernetesResource } from '../model/kubernetesresource.model';
import { INamespaceScope, NamespaceScope } from './namespace.scope';
import { Watcher } from './watcher';
import { pathJoin } from '../model/utils';


export abstract class NamespacedResourceService<T extends KubernetesResource, L extends Array<T>> extends KubernetesService<T, L> {
  private namespaceSubscription: Subscription;
  private _namespace: string;
  protected _serviceUrl: string;

  constructor(
    kubernetesRestangular: Restangular,
    private namespaceScope: INamespaceScope,
    private urlSuffix: string,
    watcherFactory: WatcherFactory,
    private urlPrefix: string = '/api/v1/namespaces/'
  ) {
    super(kubernetesRestangular, watcherFactory);
    this.namespace = namespaceScope.currentNamespace();

    if (this.namespaceScope) {
      this.namespaceSubscription = this.namespaceScope.namespace.subscribe(
        namespace => {
          this.namespace = namespace;
        }
      );
    }
  }


  /**
   * Creates a watcher that can watch for events
   * @param queryParams
   */
  watchNamepace(namespace: string, queryParams: any = null) {
    if (namespace) {
      let listFactory = () => this.list(namespace, queryParams);
      return this.watcherFactory.newInstance(() => this.serviceUrlForNamespace(namespace), queryParams, listFactory);
    }
    return this.watch(queryParams);
  }



  get namespace(): string {
    return this._namespace;
  }

  set namespace(namespace: string) {
    if (namespace && namespace != this._namespace) {
      this._namespace = namespace;
      this._serviceUrl = null;
      this.onNamespaceChanged();
    }
  }

  get(id: string, namespace: string = null): Observable<T> {
    let url = namespace ? this.serviceUrlForNamespace(namespace) : this.serviceUrl;
    return this.restangularService.one(url, id).get();
  }

  list(namespace: string = null, queryParams: any = null): Observable<L> {
    let url = namespace ? this.serviceUrlForNamespace(namespace) : this.serviceUrl;
    if (!url) {
      return Observable.empty();
    }
    return this.restangularService.all(url).getList(queryParams);
  }


  create(obj: T, namespace: string = null): Observable<T> {
    let url = this.urlForObject(obj, namespace);
    let resource = obj.resource || {};
    if (!resource.kind) {
      resource.kind = obj.defaultKind();
    }
    obj.updateResource(resource);
    console.log('Creating resource with value ' + JSON.stringify(resource, null, '  '));

    return this.restangularService.all(url).post(resource);
  }

  delete(obj: T): any {
    let url = this.urlForObject(obj);
    let id = obj.name;
    if (id) {
      return this.restangularService.one(url, id).remove();
    } else {
      return super.delete(obj);
    }
  }

  protected urlForObject(obj: T, namespace: string = '') {
    if (!namespace) {
      namespace = obj.namespace;
    }
    let url = namespace ? this.serviceUrlForNamespace(namespace) : this.serviceUrl;
    return url;
  }

  /**
   * Returns the service URL to use for the current namespace scope
   */
  get serviceUrl(): string {
    if (!this._serviceUrl) {
      this._serviceUrl = this.serviceUrlForNamespace(this.namespace);
    }
    return this._serviceUrl;
  }

  /**
   * Returns the base URL to use for the given namespace
   */
  protected serviceUrlForNamespace(namespace: string) {
    return this.createServiceUrl(this.urlPrefix, namespace, this.urlSuffix);
  }

  protected createServiceUrl(urlPrefix: string, namespace: string, urlSuffix: string): string {
    if (namespace) {
      let url = pathJoin(urlPrefix, namespace, urlSuffix);
      //console.log("setting url to: " + url);
      return url;
    }
    return '';
  }


  // TODO
  ngOnDestroy() {
    this.namespaceSubscription.unsubscribe();
  }

  protected onNamespaceChanged() {
  }
}
