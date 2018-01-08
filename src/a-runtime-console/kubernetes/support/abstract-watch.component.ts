import { OnDestroy } from '@angular/core';
import { Observable, Subject, Subscriber, Subscription } from 'rxjs';
import { Deployment, Deployments } from '../model/deployment.model';
import { DeploymentConfig } from '../model/deploymentconfig.model';
import { KubernetesResource } from '../model/kubernetesresource.model';
import { combineReplicaSets, ReplicaSet } from '../model/replicaset.model';
import { ReplicationController } from '../model/replicationcontroller.model';
import { Route } from '../model/route.model';
import { enrichServiceWithRoute, Service, Services } from '../model/service.model';
import { DeploymentService } from '../service/deployment.service';
import { DeploymentConfigService } from '../service/deploymentconfig.service';
import { NamespacedResourceService } from '../service/namespaced.resource.service';
import { ReplicaSetService } from '../service/replicaset.service';
import { ReplicationControllerService } from '../service/replicationcontroller.service';
import { messageEventToResourceOperation, Operation } from '../service/resource-operation';
import { RouteService } from '../service/route.service';
import { ServiceService } from '../service/service.service';
import { Watcher } from '../service/watcher';
import { combineDeployments, createDeploymentViews, DeploymentViews } from '../view/deployment.view';
import { createReplicaSetViews, ReplicaSetViews } from '../view/replicaset.view';

/**
 * A base class for components which watch kubernetes resources which contains a number of helper functions
 * for watching various kinds of resources in kubernetes together with logic to help close up watches after the
 * component has been used
 */
export class AbstractWatchComponent implements OnDestroy {
  public subjectCache: Map<string, Subject<any[]>> = new Map<string, Subject<any[]>>();
  private watchCache: Map<string, Watcher<any>> = new Map<string, Watcher<any>>();

  ngOnDestroy(): void {
    for (let key in this.subjectCache) {
      let subject = this.subjectCache[key];
      if (subject) {
        subject.unsubscribe();
      }
    }
    this.subjectCache.clear();
    for (let key in this.watchCache) {
      let watch = this.watchCache[key];
      if (watch) {
        watch.close();
      }
    }
    this.watchCache.clear();
  }

  protected listAndWatchServices(namespace: string, serviceService: ServiceService, routeService: RouteService): Observable<Services> {
    return Observable.combineLatest(
      this.listAndWatch(serviceService, namespace, Service),
      this.listAndWatch(routeService, namespace, Route),
      enrichServiceWithRoute
    );
  }

  listAndWatchCombinedDeployments(namespace: string, deploymentService: DeploymentService, deploymentConfigService: DeploymentConfigService): Observable<Deployments> {
    return Observable.combineLatest(
      this.listAndWatch(deploymentService, namespace, Deployment),
      this.listAndWatch(deploymentConfigService, namespace, DeploymentConfig),
      combineDeployments
    );
  }

  listAndWatchDeployments(namespace: string, deploymentService: DeploymentService, deploymentConfigService: DeploymentConfigService, serviceService: ServiceService, routeService: RouteService): Observable<DeploymentViews> {
    const servicesObservable = this.listAndWatchServices(namespace, serviceService, routeService);

    let deployments = this.listAndWatchCombinedDeployments(namespace, deploymentService, deploymentConfigService);
    let runtimeDeployments = Observable.combineLatest(
      deployments,
      servicesObservable,
      createDeploymentViews
    );
    return runtimeDeployments;
  }

  listAndWatchReplicas(namespace: string, replicaSetService: ReplicaSetService, replicationControllerService: ReplicationControllerService, serviceService: ServiceService, routeService: RouteService): Observable<ReplicaSetViews> {
    const servicesObservable = this.listAndWatchServices(namespace, serviceService, routeService);

    let replicas = Observable.combineLatest(
      this.listAndWatch(replicaSetService, namespace, ReplicaSet),
      this.listAndWatch(replicationControllerService, namespace, ReplicationController),
      combineReplicaSets
    );
    let replicaViews = Observable.combineLatest(
      replicas,
      servicesObservable,
      createReplicaSetViews
    );
    return replicaViews;
  }


  protected listAndWatch<T extends KubernetesResource, L extends Array<T>>(
    service: NamespacedResourceService<T, L>,
    namespace: string,
    type: { new (): T; }
  ): Observable<L> {
    let key = namespace + '/' + type.name;
    return this.getOrCreateSubject(key, () =>
       Observable.combineLatest(
              //this.getOrCreateList(service, namespace, type),
              service.list(namespace),
              // We just emit an empty item if the watch fails
              this.getOrCreateWatch(service, namespace, type)
                .dataStream.catch(() => Observable.of(null)),
              (list, msg) => this.combineListAndWatchEvent(list, msg, service, type, namespace)
            )
    );
  }

  protected getOrCreateSubject<T extends KubernetesResource, L extends Array<T>>(
      key: string,
      createObserverFn: () => Observable<L>
  ): Observable<L> {
    let answer = this.subjectCache[key];
    if (!answer) {
      let observable = createObserverFn();
      answer = new CachingSubject(observable);
      this.subjectCache[key] = answer;
    }
    return answer.asObservable();
  }


  protected getOrCreateWatch<T extends KubernetesResource, L extends Array<T>>(
    service: NamespacedResourceService<T, L>,
      namespace: string,
      type: { new (): T; }
  ): Watcher<L> {
    let key = namespace + '/' + type.name;
    let answer = this.watchCache[key];
    if (!answer) {
      answer = service.watchNamepace(namespace);
      this.watchCache[key] = answer;
    }
    return answer;
  }

  /**
   * Lets combine the web socket events with the latest list
   */
  protected combineListAndWatchEvent<T extends KubernetesResource, L extends Array<T>>(array: L, msg: any, service: NamespacedResourceService<T, L>, objType: { new (): T; }, namespace: string): L {
    let resourceOperation = messageEventToResourceOperation(msg);
    if (resourceOperation) {
      let operation = resourceOperation.operation;
      let resource = resourceOperation.resource;
      switch (operation) {
        case Operation.ADDED:
          return createNewArrayToForceRefresh(this.upsertItem(array, resource, service, objType));
        case Operation.MODIFIED:
          return this.upsertItem(array, resource, service, objType);
        case Operation.DELETED:
          return createNewArrayToForceRefresh(this.deleteItemFromArray(array, resource));
        default:
          console.log('Unknown resource option ' + operation + ' for ' + resource + ' on ' + service.serviceUrl + '/' + namespace);
      }
    }
/*
    if (msg instanceof MessageEvent) {
      let me = msg as MessageEvent;
      let data = me.data;
      if (data) {
        var json = JSON.parse(data);
        if (json) {
          let type = json.type;
          let resource = json.object;
          if (type && resource) {
            switch (type) {
              case 'ADDED':
                return createNewArrayToForceRefresh(this.upsertItem(array, resource, service, objType));
              case 'MODIFIED':
                return this.upsertItem(array, resource, service, objType);
              case 'DELETED':
                return createNewArrayToForceRefresh(this.deleteItemFromArray(array, resource));
              default:
                console.log('Unknown WebSocket event type ' + type + ' for ' + resource + ' on ' + service.serviceUrl + '/' + namespace);
            }
          }
        }
      }
    }
    */
    return array;
  }

  protected upsertItem<T extends KubernetesResource, L extends Array<T>>(array: L, resource: any, service: NamespacedResourceService<T, L>, type: { new (): T; }): L {
    let n = this.nameOfResource(resource);
    if (array && n) {
      for (let i = 0; i < array.length; i++) {
        let item = array[i];
        var name = item.name;
        if (name && name === n) {
          item.setResource(resource);
          return array;
        }
      }

      // now lets add the new item!
      let item = new type();
      item.setResource(resource);
      // lets add the Restangular crack
      item = service.restangularize(item);
      array.push(item);
    }
    return array;
  }


  protected deleteItemFromArray<T extends KubernetesResource, L extends Array<T>>(array: L, resource: any): L {
    let n = this.nameOfResource(resource);
    if (array && n) {
      for (var i = 0; i < array.length; i++) {
        let item = array[i];
        var name = item.name;
        if (name && name === n) {
          array.splice(i, 1);
        }
      }
    }
    return array;
  }

  nameOfResource(resource: any) {
    let obj = resource || {};
    let metadata = obj.metadata || {};
    return obj.name || metadata.name || '';
  }
}

/**
 * Lets send the last value to any new subscriber before any new values.
 *
 * Unlike BehaviorSubject there is no need for an initial value.
 * Unlike AsyncSubject we don't need to wait for complete before sending a next event
 */
export class CachingSubject<T> extends Subject<T> {
  private _value: T;
  private _hasValue = false;
  private _subscription: Subscription;

  constructor(protected observable: Observable<T>) {
    super();
    this._subscription = observable.subscribe(this);
  }

  unsubscribe(): void {
    this._subscription.unsubscribe();
    super.unsubscribe();
  }

  next(value?: T): void {
    this._value = value;
    this._hasValue = true;
    super.next(value);
  }


  protected _subscribe(subscriber: Subscriber<T>): Subscription {
    if (this._hasValue) {
      subscriber.next(this._value);
    }
    return super._subscribe(subscriber);
  }
}

/**
 * Lets create a new array instance to force an update event on insert or delete to lists
 */
function createNewArrayToForceRefresh<T extends KubernetesResource, L extends Array<T>>(array: L): L {
  return array.slice() as L;
}
