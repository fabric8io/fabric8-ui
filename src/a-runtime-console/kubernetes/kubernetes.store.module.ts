import {WatcherFactory} from "./service/watcher-factory.service";
import {NgModule, Optional, SkipSelf} from "@angular/core";
import {ServiceStore} from "./store/service.store";
import {ServiceService} from "./service/service.service";
import {KubernetesRestangularModule} from "./service/kubernetes.restangular";
import {DeploymentService} from "./service/deployment.service";
import {DeploymentStore} from "./store/deployment.store";
import {EventService} from "./service/event.service";
import {EventStore} from "./store/event.store";
import {PodService} from "./service/pod.service";
import {PodStore} from "./store/pod.store";
import {NamespaceService} from "./service/namespace.service";
import {NamespaceStore} from "./store/namespace.store";
import {ReplicaSetService} from "./service/replicaset.service";
import {ReplicaSetStore} from "./store/replicaset.store";
import {ReplicationControllerService} from "./service/replicationcontroller.service";
import {ReplicationControllerStore} from "./store/replicationcontroller.store";
import {RestangularModule} from "ng2-restangular";
import {NamespaceScope} from "./service/namespace.scope";
import {ConfigMapService} from "./service/configmap.service";
import {ConfigMapStore} from "./store/configmap.store";
import {BuildConfigService} from "./service/buildconfig.service";
import {BuildConfigStore} from "./store/buildconfig.store";
import {APIsStore} from "./store/apis.store";
import {DeploymentConfigService} from "./service/deploymentconfig.service";
import {DeploymentConfigStore} from "./store/deploymentconfig.store";
import {CompositeDeploymentStore} from "./store/compositedeployment.store";
import {BuildService} from "./service/build.service";
import {BuildStore} from "./store/build.store";
import {SpaceStore} from "./store/space.store";
import {DevNamespaceScope} from "./service/devnamespace.scope";
import {OAuthService} from "angular2-oauth2/oauth-service";
import {OAuthConfigStore} from "./store/oauth-config-store";
import {LocalStorageModule} from "angular-2-local-storage";
import {RouteServiceStore} from "./store/route.service.store";
import {RouteService} from "./service/route.service";
import {RouteStore} from "./store/route.store";
import {CompositeReplicaSetStore} from "./store/compositedreplicaset.store";
import {SpaceNamespace} from "./model/space-namespace";
import {SpaceNamespaceService} from "./service/space-namespace.service";
import {PollerFactory} from "./service/poller-factory.service";
/*
import {RouterModule} from "@angular/router";
import {BrowserModule} from "@angular/platform-browser";
*/

@NgModule({
  imports: [
/*
    BrowserModule,
    RouterModule,
*/
    RestangularModule,
    KubernetesRestangularModule,
    LocalStorageModule.withConfig({
      prefix: 'fabric8',
      storageType: 'localStorage'
    }),
  ],
  providers: [
    APIsStore,
    BuildService,
    BuildStore,
    BuildConfigService,
    BuildConfigStore,
    CompositeDeploymentStore,
    CompositeReplicaSetStore,
    ConfigMapService,
    ConfigMapStore,
    DevNamespaceScope,
    NamespaceScope,
    DeploymentConfigService,
    DeploymentConfigStore,
    DeploymentService,
    DeploymentStore,
    EventService,
    EventStore,
    NamespaceService,
    NamespaceStore,
    // TODO Move to app.module
    OAuthConfigStore,
    // TODO Move to app.module
    OAuthService,
    PodService,
    PodStore,
    PollerFactory,
    ReplicaSetService,
    ReplicaSetStore,
    ReplicationControllerService,
    ReplicationControllerStore,
    RouteService,
    RouteStore,
    RouteServiceStore,
    ServiceService,
    ServiceStore,
    SpaceStore,
    WatcherFactory,
    {
      provide: SpaceNamespace,
      useClass: SpaceNamespaceService
    },
  ],
})
export class KubernetesStoreModule {
  constructor( @Optional() @SkipSelf() parentModule: KubernetesStoreModule) {
    if (parentModule) {
      throw new Error(
        'KubernetesStoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
