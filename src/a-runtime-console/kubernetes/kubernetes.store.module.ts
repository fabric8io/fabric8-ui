import { NgModule, Optional, SkipSelf } from '@angular/core';
import { LocalStorageModule } from 'angular-2-local-storage';
import { OAuthService } from 'angular2-oauth2/oauth-service';
import { RestangularModule } from 'ng2-restangular';
import { SpaceNamespace } from './model/space-namespace';
import { BuildService } from './service/build.service';
import { BuildConfigService } from './service/buildconfig.service';
import { ConfigMapService } from './service/configmap.service';
import { DeploymentService } from './service/deployment.service';
import { DeploymentConfigService } from './service/deploymentconfig.service';
import { DevNamespaceScope } from './service/devnamespace.scope';
import { EventService } from './service/event.service';
import { KubernetesRestangularModule } from './service/kubernetes.restangular';
import { NamespaceScope } from './service/namespace.scope';
import { NamespaceService } from './service/namespace.service';
import { PodService } from './service/pod.service';
import { PollerFactory } from './service/poller-factory.service';
import { ReplicaSetService } from './service/replicaset.service';
import { ReplicationControllerService } from './service/replicationcontroller.service';
import { RouteService } from './service/route.service';
import { ServiceService } from './service/service.service';
import { SpaceNamespaceService } from './service/space-namespace.service';
import { WatcherFactory } from './service/watcher-factory.service';
import { APIsStore } from './store/apis.store';
import { BuildStore } from './store/build.store';
import { BuildConfigStore } from './store/buildconfig.store';
import { CompositeDeploymentStore } from './store/compositedeployment.store';
import { CompositeReplicaSetStore } from './store/compositedreplicaset.store';
import { ConfigMapStore } from './store/configmap.store';
import { DeploymentStore } from './store/deployment.store';
import { DeploymentConfigStore } from './store/deploymentconfig.store';
import { EventStore } from './store/event.store';
import { NamespaceStore } from './store/namespace.store';
import { OAuthConfigStore } from './store/oauth-config-store';
import { PodStore } from './store/pod.store';
import { ReplicaSetStore } from './store/replicaset.store';
import { ReplicationControllerStore } from './store/replicationcontroller.store';
import { RouteServiceStore } from './store/route.service.store';
import { RouteStore } from './store/route.store';
import { ServiceStore } from './store/service.store';
import { SpaceStore } from './store/space.store';
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
    })
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
    }
  ]
})
export class KubernetesStoreModule {
  constructor(@Optional() @SkipSelf() parentModule: KubernetesStoreModule) {
    if (parentModule) {
      throw new Error(
        'KubernetesStoreModule is already loaded. Import it in the AppModule only');
    }
  }
}
