import {BehaviorSubject, ConnectableObservable, Observable, Subject, Subscription} from "rxjs";
import {Notifications} from "ngx-base";
import {Pod, Pods} from "../../model/pod.model";
import {Component, OnInit, OnDestroy} from "@angular/core";
import {AbstractWatchComponent} from "../../support/abstract-watch.component";
import {PodService} from "../../service/pod.service";
import {SpaceStore} from "../../store/space.store";
import {SpaceNamespace} from "../../model/space-namespace";
import {Space} from "../../model/space.model";
import {Namespace} from "../../model/namespace.model";
import {DeploymentConfigService} from "../../service/deploymentconfig.service";
import {DeploymentService} from "../../service/deployment.service";
import {Deployments} from "../../model/deployment.model";

export class StatusKind {
  constructor(public message: string, public iconCss: string) {
  }
}

const statusCssUnknown = new StatusKind("Loading data", "pficon pficon-warning-triangle-o");
const statusCssError = new StatusKind("Error", "pficon pficon-error-circle-o");
const statusCssOK = new StatusKind("OK", "pficon pficon-ok");
const statusCssPending = new StatusKind("Pending", "fa fa-hourglass-o");
const statusCssContainerCreating = new StatusKind("Creating", "fa fa-cog fa-spin fa-fw");
const statusCssNoResource = new StatusKind("Off", "fa fa-power-off");

export class StatusInfo {
  hasResource = false;
  loaded = false;
  statusMessage = "";

  constructor(public iconCss: string = statusCssUnknown.iconCss, public version: string = "") {
  }

  set status(status: StatusKind) {
    this.iconCss = status.iconCss;
    this.statusMessage = status.message;
  }
}

export class StatusWatcher {
  private _subject = new BehaviorSubject(new StatusInfo());
  private _subscription: Subscription;

  namespace: Namespace;

  replaceSubscription(namespace: Namespace, observer: Observable<StatusInfo>) {
    this.unsubscribe();
    this.namespace = namespace;
    // now lets emit a loading status
    let status = new StatusInfo();
    status.status = statusCssPending;
    this._subject.next(status);
    this._subscription = observer.subscribe(this._subject);
    return this.data;
  }

  get data(): Observable<StatusInfo> {
    return this._subject.asObservable();
  }

  unsubscribe() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}

@Component({
  selector: 'fabric8-status-list',
  templateUrl: './status-list.component.html',
  styleUrls: ['./status-list.component.less'],
})
export class StatusListComponent extends AbstractWatchComponent implements OnInit, OnDestroy {
  space: ConnectableObservable<Space>;
  loading: Subject<boolean> = new BehaviorSubject(true);

  private pipelineStatus = new StatusWatcher();
  private cheStatus = new StatusWatcher();

  private cheSubscription: Subscription;
  private pipelineSubscription: Subscription;

  constructor(private deploymentConfigService: DeploymentConfigService,
              private deploymentService: DeploymentService,
              private spaceNamespace: SpaceNamespace,
              private spaceStore: SpaceStore,
              private podService: PodService,
              private notifications: Notifications,) {
    super();
  }

  get pipelineStatusObserver(): Observable<StatusInfo> {
    return this.pipelineStatus.data;
  }

  get cheStatusObserver(): Observable<StatusInfo> {
    return this.cheStatus.data;
  }

  ngOnInit() {
    this.space = this.spaceNamespace.namespaceSpace
      .distinctUntilChanged()
      .switchMap((id) => {
        this.spaceStore.load(id);
        return this.spaceStore.resource;
      })
      .publish();

    this.pipelineSubscription = this.space
      .map(space => space ? space.jenkinsNamespace : null)
      .distinctUntilChanged(distinctNamespace)
      .subscribe(ns => {
        if (ns) {
          let namespaceName = ns.name;
          let data = this.listAndWatch(this.podService, namespaceName, Pod).map(pods => podsToStatusInfo(pods, "app", "jenkins-openshift"));
          this.loading.next(false);
          this.pipelineStatus.replaceSubscription(ns, data);
        }
      });

    this.cheSubscription = this.space
      .map(space => space ? space.cheNamespace : null)
      .distinctUntilChanged(distinctNamespace)
      .subscribe(ns => {
        if (ns) {
          let namespaceName = ns.name;
          let data = this.listAndWatchCombinedDeployments(namespaceName, this.deploymentService, this.deploymentConfigService).map(deployments => deploymentsToStatusInfo(deployments, "app", "che"));
          this.loading.next(false);
          this.cheStatus.replaceSubscription(ns, data);
        }
      });

    this.space.connect();

  }

  ngOnDestroy(): void {
    super.ngOnDestroy();

    this.pipelineStatus.unsubscribe();
    this.cheStatus.unsubscribe();
    this.pipelineSubscription.unsubscribe();
    this.cheSubscription.unsubscribe();
  }
}

function distinctNamespace(n1: Namespace, n2: Namespace): boolean {
  let name1 = n1 ? n1.name : "";
  let name2 = n2 ? n2.name : "";
  return name1 === name2;
}

function deploymentsToStatusInfo(deployments: Deployments, labelKey: string, labelValue: string): StatusInfo {
  let answer = new StatusInfo();
  answer.loaded = true;
  let status = statusCssNoResource;
  if (deployments && deployments.length) {
    for (let deployment of deployments) {
      if (deployment.labels[labelKey] === labelValue) {
        status = statusCssPending;
        answer.hasResource = true;
        answer.version = deployment.labels["version"];
        // TODO lets just assume the first one is the status?
        if (deployment.availableReplicas) {
          status = statusCssOK;
        } else if (!deployment.replicas) {
          status = statusCssNoResource;
        }
      }
    }
  }
  answer.status = status;
  return answer;
}

function podsToStatusInfo(pods: Pods, labelKey: string, labelValue: string): StatusInfo {
  let answer = new StatusInfo();
  answer.loaded = true;
  let status = statusCssNoResource;
  if (pods && pods.length) {
    for (let pod of pods) {
      if (pod.labels[labelKey] === labelValue) {
        status = statusCssPending;
        answer.hasResource = true;
        answer.version = pod.labels["version"];
        // TODO lets just assume the first one is the status?
        status = podPhaseToCss(pod.phase);
      }
    }
  }
  answer.status = status;
  return answer;
}

/**
 * Converts a pod phase to a CSS style to render
 */
function podPhaseToCss(phase: string): StatusKind {
  switch (phase) {
    case "Ready":
      return statusCssOK;
    case "Pending":
      return statusCssPending;
    case "ContainerCreating":
      return statusCssContainerCreating;
    default:
      return statusCssError;
  }
}

function apiStatus(data) {
  console.log(data.status);
}
