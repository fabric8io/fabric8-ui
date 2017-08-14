import {BehaviorSubject, ConnectableObservable, Observable, Subject, Subscriber} from "rxjs";
import {Notifications} from "ngx-base";
import {DeploymentService} from "./../../../service/deployment.service";
import {Environment, Space} from "./../../../model/space.model";
import {ServiceService} from "./../../../service/service.service";
import {DeploymentConfigService} from "./../../../service/deploymentconfig.service";
import {SpaceStore} from "./../../../store/space.store";
import {Component, OnDestroy, OnInit} from "@angular/core";
import {RouteService} from "../../../service/route.service";
import {AbstractWatchComponent} from "../../../support/abstract-watch.component";
import {environmentOpenShiftConoleUrl} from "../../environment/list-page/list-page.environment.component";
import {DeploymentView, DeploymentViews} from "../../../view/deployment.view";
import {SpaceNamespace} from "../../../model/space-namespace";
import {sortedKeys} from "../../../model/build.model";
import {ActivatedRoute} from "@angular/router";
import {findParameter} from "../../../model/helpers";
import {Subscription} from "rxjs/Subscription";

@Component({
  selector: 'fabric8-apps-list-page',
  templateUrl: './list-page.app.component.html',
})
export class AppListPageComponent extends AbstractWatchComponent implements OnInit, OnDestroy {

  loading: Subject<boolean> = new BehaviorSubject(true);

  private space: Observable<Space>;
  private spaceSubscription: Subscription;
  private idSubscription: Subscription;

  protected environmentCache: Map<string, EnvironmentDeployments> = new Map<string, EnvironmentDeployments>();
  protected subscriberCache: Map<string, Subscriber<any>> = new Map<string, Subscriber<any>>();

  protected appsSubject: Subject<AppDeployments[]> = new BehaviorSubject([]);

  private listCache: Map<string, Observable<any[]>> = new Map<string, Observable<any[]>>();

  constructor(private serviceService: ServiceService,
              private routeService: RouteService,
              private spaceStore: SpaceStore,
              private deploymentConfigService: DeploymentConfigService,
              private deploymentService: DeploymentService,
              private spaceNamespace: SpaceNamespace,
              private notifications: Notifications,
              private route: ActivatedRoute,) {
    super();
  }

  ngOnInit() {
    this.space = this.spaceStore.resource;
    this.spaceSubscription = this.space.subscribe(space => {
      // TODO remove any old environments?
      if (space) {
        let environments = space.environments || [];
        if (environments.length) {
          environments.forEach(env => {
            this.subscribeToDeployments(space, env);
          });
        }
      }
    });

    this.idSubscription = this.spaceNamespace.namespaceSpace
      .distinctUntilChanged().subscribe(id => {
        if (id) {
          this.spaceStore.load(id)
        }
      });
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.spaceSubscription) {
      this.spaceSubscription.unsubscribe();
    }
    if (this.idSubscription) {
      this.idSubscription.unsubscribe();
    }

    for (let key in this.subscriberCache) {
      let subscriber = this.subscriberCache[key];
      if (subscriber) {
        subscriber.unsubscribe();
      }
    }

    this.subscriberCache.clear();
    this.listCache.clear();
  }


  get apps(): Observable<AppDeployments[]> {
    return this.appsSubject.asObservable();
  }


  protected subscribeToDeployments(space: Space, environment: Environment) {
    let key = environment.namespace.name;
    if (key) {
      let oldSubscriber = this.subscriberCache[key];
      if (!oldSubscriber) {
        let subscriber = this.getDeploymentsObservable(environment)
          .subscribe(deployments => this.onDeployments(space, environment, deployments));
        this.subscriberCache[key] = subscriber;
      }
    }
  }

  protected onDeployments(space: Space, environment: Environment, deployments: DeploymentViews) {
    if (!deployments) {
      return;
    }
    let envNameToIndexMap = new Map<string, number>();
    let count = 1;
    for (let env of space.environments) {
      envNameToIndexMap[env.key] = count++;
    }
    var envCount = mapSize(this.environmentCache);

    let size = count - 1;
    if (environment) {
      let name = environment.namespace.name;
      if (name) {
        this.environmentCache[name] = new EnvironmentDeployments(environment, deployments);
        if (envCount >= size) {
          this.loading.next(false);
        }
      }
    }
    let map = new Map<string, AppDeployments>();

    // now lets update the app infos
    for (let envKey in this.environmentCache) {
      let envDeployments = this.environmentCache[envKey];
      let deployments = envDeployments.deployments;
      for (let deployment of deployments) {
        let deployName = deployment.name;
        if (deployName) {
          let appInfo = map[deployName];
          if (!appInfo) {
            appInfo = new AppDeployments(envCount);
            map[deployName] = appInfo;
          }
          appInfo.addDeployment(envNameToIndexMap, envDeployments.environment, deployment);
        }
      }
    }

    let keys = sortedKeys(map);
    let array: AppDeployments[] = [];
    for (let key of keys) {
      let app = map[key];
      if (app) {
        array.push(app);
      }
    }

    this.appsSubject.next(array);

    for (let appInfo of array) {
      for (var env of appInfo.environmentDetails) {
        if (!env) {
          env = new AppEnvironmentDetails();
        }
      }
    }
  }

  /**
   * Lets cache the observables so that we don't requery the services each time we ask for the observables
   */
  private getDeploymentsObservable(environment: Environment): Observable<DeploymentViews> {
    let namespace = environment.namespace.name;
    let key = namespace;
    var answer = this.listCache[key];
    if (!answer) {
      answer = this.listAndWatchDeployments(namespace, this.deploymentService, this.deploymentConfigService, this.serviceService, this.routeService).map(deploymentViews => filterDeploymentViews(deploymentViews, this.route));
      this.listCache[key] = answer;
    }
    return answer;
  }
}

function filterDeploymentViews(deploymentViews: DeploymentViews, route: ActivatedRoute): DeploymentViews {
  let spaceId = findParameter(route, "space");
  if (!spaceId) {
    return deploymentViews;
  }
  var answer = new DeploymentViews();
  deploymentViews.forEach(dep => {
    let depSpace = dep.labels["space"];
    if (!depSpace || depSpace === spaceId) {
      answer.push(dep);
    }
  });
  return answer;
}

function mapSize(map: Map<any, any>) {
  var i = 0;
  for (let env in map) {
    i++;
  }
  return i;
}

export class EnvironmentDeployments {
  openshiftConsoleUrl: string;

  constructor(public environment: Environment, public deployments: DeploymentViews) {
    this.openshiftConsoleUrl = environmentOpenShiftConoleUrl(environment);
  }
}


export class AppDeployments {
  name: string;
  icon: string;
  environmentDetails: AppEnvironmentDetails[] = [];

  constructor(envCount: number) {
    for (let i = 0; i < envCount; i++) {
      this.environmentDetails.push(new AppEnvironmentDetails());
    }
  }

  addDeployment(envNameToIndexMap: Map<string, number>, environment: Environment, deployment: DeploymentView) {
    if (!this.name) {
      this.name = deployment.name;
    }
    if (!this.icon) {
      this.icon = deployment.icon;
    }
    let key = environment.key;
    if (key) {
      let idx = envNameToIndexMap[key];
      if (idx) {
        idx--;
        var envInfo = this.environmentDetails[idx];
        if (!envInfo) {
          envInfo = new AppEnvironmentDetails();
          this.environmentDetails[idx] = envInfo;
        }
        envInfo.addDeployment(this, environment, deployment);
      }
    }
  }
}

export class AppEnvironmentDetails {
  environment: Environment;
  deployment: DeploymentView;
  version: string;
  environmentName: string;
  exposeUrl: string;

  addDeployment(appDeployments: AppDeployments, environment: Environment, deployment: DeploymentView) {
    this.environment = environment;
    this.deployment = deployment;
    this.version = deployment.version;
    this.environmentName = environment.name;

    // lets only show the service URL if there are available pods
    if (deployment.availableReplicas) {
      this.exposeUrl = deployment.exposeUrl;
    } else {
      this.exposeUrl = "";
    }
  }
}
