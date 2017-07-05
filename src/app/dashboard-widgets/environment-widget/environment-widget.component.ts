import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable, Subscription, ConnectableObservable, Subscriber, Subject, BehaviorSubject } from 'rxjs/Rx';

import { Contexts, Context } from 'ngx-fabric8-wit';

import {
  SpaceStore, Space, Environment
} from 'fabric8-runtime-console';

// non-exported classes from runtime that need to be refactored
import { DeploymentView, DeploymentViews } from 'fabric8-runtime-console/src/app/kubernetes/view/deployment.view';
import { AppEnvironmentDetails, AppDeployments, EnvironmentDeployments } from 'fabric8-runtime-console/src/app/kubernetes/ui/app/list-page/list-page.app.component';
import { AbstractWatchComponent } from 'fabric8-runtime-console/src/app/kubernetes/support/abstract-watch.component';
import { DeploymentService } from "fabric8-runtime-console/src/app/kubernetes/service/deployment.service";
import { ServiceService } from "fabric8-runtime-console/src/app/kubernetes/service/service.service";
import { DeploymentConfigService } from "fabric8-runtime-console/src/app/kubernetes/service/deploymentconfig.service";
import { RouteService } from "fabric8-runtime-console/src/app/kubernetes/service/route.service";

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'fabric8-environment-widget',
  templateUrl: './environment-widget.component.html',
  styleUrls: ['./environment-widget.component.less']
})
export class EnvironmentWidgetComponent extends AbstractWatchComponent  implements OnInit, OnDestroy {

  loading: Subject<boolean> = new BehaviorSubject(true);
  contextPath: Observable<string>;
  appsCount: number = 0;
  contextSubscription: Subscription;
  currentContext: Context;
  space: ConnectableObservable<Space>;

  protected environmentCache: Map<string, EnvironmentDeployments> = new Map<string, EnvironmentDeployments>();
  protected subscriberCache: Map<string, Subscription> = new Map<string, Subscription>();
  protected appsSubject: Subject<AppDeployments[]> = new BehaviorSubject([]);
  private listCache: Map<string, Observable<any[]>> = new Map<string, Observable<any[]>>();

  constructor(private context: Contexts,
              private spaceStore: SpaceStore,
              private serviceService: ServiceService,
              private routeService: RouteService,
              public route: ActivatedRoute,
              private deploymentConfigService: DeploymentConfigService,
              private deploymentService: DeploymentService) {
    super();
  }

  ngOnInit() {
    this.contextSubscription = this.context.current.subscribe((context) => {
      this.currentContext = context;
      let pathRegex = new RegExp(/^\/(.+?)\//);
      let pathSections = pathRegex.exec(context.path);
      if (pathSections && pathSections.length > 0) {
        let id = pathSections[1];
        this.spaceStore.load(id);

        this.environmentCache.clear();
        this.subscriberCache.clear();
        this.listCache.clear();
      }
    });

    this.contextPath = this.context.current.map(context => context.path);

    this.space = this.spaceStore.resource
      .distinctUntilChanged()
      .debounce(space => ((space && space.environments) ? Observable.interval(0) : Observable.interval(1000)))
      .do(space => {
        if (space === null) {
          this.appsSubject.next([]);
          this.appsCount = 0;
        }
      })
      .publish();

    this.space.subscribe(space => {
      if (space && space.environments) {
        space.environments.forEach(env => {
          this.subscribeToDeployments(space, env);
        });
        this.appsCount = space.environments.length;
      }
    });

    this.space.connect();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.contextSubscription.unsubscribe();

    this.subscriberCache.forEach((subscriber) => {
      if (subscriber) {
        subscriber.unsubscribe();
      }
    });

    this.subscriberCache.clear();
    this.listCache.clear();
  }


  get apps(): Observable<AppDeployments[]> {
    return this.appsSubject.asObservable();
  }


  protected subscribeToDeployments(space: Space, environment: Environment) {
    let key = environment.namespace.name;
    if (key) {
      let oldSubscriber = this.subscriberCache.get(key);
      if (!oldSubscriber) {
        let subscriber = this.getDeploymentsObservable(environment)
          .subscribe(deployments =>  this.onDeployments(space, environment, deployments));
        this.subscriberCache.set(key, subscriber);
      }
    }
  }

  protected onDeployments(space: Space, environment: Environment, deployments: DeploymentViews) {
    if (!deployments) {
      return;
    }
    let envNameToIndexMap = new Map<string,number>();
    let count = 1;
    for (let env of space.environments) {
      envNameToIndexMap.set(env.key, count++);
    }

    let size = count - 1;
    if (environment) {
      let name = environment.namespace.name;
      if (name) {
        this.environmentCache.set(name, new EnvironmentDeployments(environment, deployments));
        if (this.environmentCache.size >= size) {
          this.loading.next(false);
        }
      }
    }
    let map = new Map<string, AppDeployments>();

    // now lets update the app infos
    this.environmentCache.forEach((envDeployments) => {
      let deployments = envDeployments.deployments;
      for (let deployment of deployments) {
        let deployName = deployment.name;
        if (deployName) {
          let appInfo = map.get(deployName);
          if (!appInfo) {
            appInfo = new AppDeployments(this.environmentCache.size);
            map.set(deployName, appInfo);
          }
          this.addDeployment(appInfo, envNameToIndexMap, envDeployments.environment, deployment);
        }
      }
    });

    let array: AppDeployments[] = [];
    map.forEach((app) => {
      if (app) {
        array.push(app);
      }
    });

    this.appsSubject.next(array);

    for (let appInfo of array) {
      for (let env of appInfo.environmentDetails) {
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
    var answer = this.listCache.get(key);
    if (!answer) {
      answer = this.listAndWatchDeployments(namespace, this.deploymentService, this.deploymentConfigService, this.serviceService, this.routeService).
      map(deploymentViews => this.filterDeploymentViews(deploymentViews));
      this.listCache.set(key, answer);
    }
    return answer;
  }

  private addDeployment(appInfo: AppDeployments, envNameToIndexMap: Map<string,number>, environment: Environment, deployment: DeploymentView) {
    if (!appInfo.name) {
      appInfo.name = deployment.name;
    }
    if (!appInfo.icon) {
      appInfo.icon = deployment.icon;
    }
    let key = environment.key;
    if (key) {
      let idx = envNameToIndexMap.get(key);
      if (idx) {
        idx--;
        let envInfo = appInfo.environmentDetails[idx];
        if (!envInfo) {
          envInfo = new AppEnvironmentDetails();
          appInfo.environmentDetails[idx] = envInfo;
        }
        envInfo.addDeployment(appInfo, environment, deployment);
      }
    }
  }

  private filterDeploymentViews(deploymentViews: DeploymentViews): DeploymentViews {
    let spaceId = this.currentContext.space.attributes.name;
    if (!spaceId) {
      return deploymentViews;
    }
    let answer = new DeploymentViews();
    deploymentViews.forEach(dep => {
      let depSpace = dep.labels["space"];
      if (!depSpace || depSpace === spaceId) {
        answer.push(dep);
      }
    });
    return answer;
  }
}
