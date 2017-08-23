import {BehaviorSubject, ConnectableObservable, Observable, Subject, Subscription} from "rxjs";
import {Notifications, Notification, NotificationType} from "ngx-base";
import {Deployment} from "./../../../model/deployment.model";
import {DeploymentService} from "./../../../service/deployment.service";
import {SpaceNamespace} from "../../../model/space-namespace";
import {Service} from "./../../../model/service.model";
import {Pod} from "./../../../model/pod.model";
import {Event} from "./../../../model/event.model";
import {ConfigMap} from "./../../../model/configmap.model";
import {Environment, Space} from "./../../../model/space.model";
import {ServiceService} from "./../../../service/service.service";
import {ReplicaSetService} from "./../../../service/replicaset.service";
import {PodService} from "./../../../service/pod.service";
import {EventService} from "./../../../service/event.service";
import {ConfigMapService} from "./../../../service/configmap.service";
import {DeploymentConfigService} from "./../../../service/deploymentconfig.service";
import {SpaceStore} from "./../../../store/space.store";
import {Component, OnInit, OnDestroy} from "@angular/core";
import {isOpenShift} from "../../../store/apis.store";
import {pathJoin} from "../../../model/utils";
import {ReplicationControllerService} from "../../../service/replicationcontroller.service";
import {RouteService} from "../../../service/route.service";
import {AbstractWatchComponent} from "../../../support/abstract-watch.component";
import {currentOAuthConfig} from "../../../store/oauth-config-store";


export let KINDS: Kind[] = [
  {
    name: 'Deployment',
    path: 'deployments',
  },
  {
    name: 'Pod',
    path: 'pods',
  },
  {
    name: 'Replica',
    path: 'replicasets',
  },
  {
    name: 'Service',
    path: 'services',
  },
  {
    name: 'ConfigMap',
    path: 'configmaps',
  },
  {
    name: 'Event',
    path: 'events',
  },
];

export class EnvironmentEntry {
  loading: boolean;

  deployments: KindNode;
  replicasets: KindNode;
  pods: KindNode;
  services: KindNode;
  configmaps: KindNode;
  events: KindNode;

  constructor(public environment: Environment,
              public  openshiftConsoleUrl: string,
              public kinds: KindNode[]) {

    this.configmaps = this.findKind("configmaps");
    this.deployments = this.findKind("deployments");
    this.events = this.findKind("events");
    this.pods = this.findKind("pods");
    this.replicasets = this.findKind("replicasets");
    this.services = this.findKind("services");
  }

  protected findKind(kind: string) {
    const kinds = this.kinds;
    if (kinds) {
      for (let k of kinds) {
        let kk = k.kind;
        if (kk && kk.name === kind || kk.path.toLowerCase() === kind) {
          return k;
        }
      }
    }
    console.log("Could not find kind `" + kind + "`!!!");
    // lets return an empty kind node for now
    return new KindNode({ name: kind, path: kind }, this.environment, Observable.of(false), Observable.of(kind), () => { return null })
  }
}

export class Kind {
  name: string;
  path: string;
}

export class KindNode {
  private subject = new BehaviorSubject([]);
  private _loaded = false;
  private _subscription: Subscription;

  constructor(public kind: Kind, public environment: Environment, public loading: Observable<boolean>, public title: Observable<string>, protected observeFn: () => Observable<any[]>) {
  }

  /**
   * Invoked to lazily start loading this data
   */
  ensureLoaded() {
    if (!this._loaded) {
      this._loaded = true;
      let observer = this.observeFn();
      if (observer) {
        this._subscription = observer.subscribe(this.subject);
      }
    }
  }

  get data(): Observable<any[]> {
    return this.subject.asObservable();
  }
}

@Component({
  host: {
    'class': 'app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'fabric8-environments-list-page',
  templateUrl: './list-page.environment.component.html',
})
export class EnvironmentListPageComponent extends AbstractWatchComponent implements OnInit, OnDestroy {

  environments: ConnectableObservable<EnvironmentEntry[]>;
  loading: Subject<boolean> = new BehaviorSubject(true);
  space: Observable<Space>;

  private idSubscription: Subscription;

  private listCache: Map<string, Observable<any[]>> = new Map<string, Observable<any[]>>();

  constructor(private serviceService: ServiceService,
    private routeService: RouteService,
    private spaceStore: SpaceStore,
    private deploymentConfigService: DeploymentConfigService,
    private deploymentService: DeploymentService,
    private configMapService: ConfigMapService,
    private eventService: EventService,
    private podService: PodService,
    private replicationControllerService: ReplicationControllerService,
    private replicaSetService: ReplicaSetService,
    private spaceNamespace: SpaceNamespace,
    private notifications: Notifications,
  ) {
    super();
  }

  ngOnInit() {
    this.space = this.spaceStore.resource;

    this.idSubscription = this.spaceNamespace.namespaceSpace
      .distinctUntilChanged().subscribe(id => {
        if (id) {
          this.spaceStore.load(id)
        }
      });

    this.environments = this.spaceNamespace.labelSpace
      .switchMap(label => this.space
        .skipWhile(space => !space)
        .map(space => space ? space.environments : [])
        .map(environments => environments.map(environment => new EnvironmentEntry(
          environment,
          environmentOpenShiftConoleUrl(environment),
          KINDS.map(kind => {

            let title = new BehaviorSubject(`${kind.name}s`);
            let loading = new BehaviorSubject(true);

            let observer = () => {
              console.log(`Now loading data for ${kind.name} and environment ${environment.name}`);

              return this.getList(kind.path, environment)
                .distinctUntilChanged()
                .map(arr => {
                  if (label) {
                    arr = arr.filter(val => {
                      // lets only filter resources with a space label
                      return !val.labels['space'] || val.labels['space'] === label;
                    });
                  }
                  loading.next(false);

                  // TODO this seems to lock up the entire browser! :)
                  //title.next(`${arr.length} ${kind.name}${arr.length === 1 ? '' : 's'}`);
                  return arr;
                });
            };
            return new KindNode(kind, environment, loading.asObservable(), title.asObservable(), observer);
          }))
        )))

      // Wait 200ms before publishing an empty value - it's probably not empty but it might be!
      //.debounce(arr => (arr.length > 0 ? Observable.interval(0) : Observable.interval(200)))
      .do(() => this.loading.next(false))
      .publish();
    this.environments.connect();
  }


  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }

    this.listCache.clear();
    // TODO is there a way to disconnect from this.space / this.environments?
  }

  private getList(kind: string, environment: Environment): Observable<any[]> {
    let namespace = environment.namespace.name;
    switch (kind) {
      case 'deployments':
        return this.listAndWatchDeployments(namespace, this.deploymentService, this.deploymentConfigService, this.serviceService, this.routeService);
      case 'configmaps':
        return this.listAndWatch(this.configMapService, namespace, ConfigMap);
      case 'events':
        return this.listAndWatch(this.eventService, namespace, Event);
      case 'pods':
        return this.listAndWatch(this.podService, namespace, Pod);
      case 'replicasets':
        return this.listAndWatchReplicas(namespace, this.replicaSetService, this.replicationControllerService, this.serviceService, this.routeService);
      case 'services':
        return this.listAndWatchServices(namespace, this.serviceService, this.routeService);
      default:
        return Observable.empty();
    }
  }
}


export function environmentOpenShiftConoleUrl(environment: Environment): string {
  let openshiftConsoleUrl = process.env.OPENSHIFT_CONSOLE_URL;
  if (!openshiftConsoleUrl) {
    let config = currentOAuthConfig();
    if (config != null) {
      openshiftConsoleUrl = config.openshiftConsoleUrl;
    }
  }
  let namespace = environment.namespaceName;
  if (namespace) {
    return pathJoin(openshiftConsoleUrl, "/project", namespace, "/overview")
  }
  return openshiftConsoleUrl;
}
