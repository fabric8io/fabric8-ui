export { Build, Builds } from './kubernetes/model/build.model';
export { SpaceNamespace } from './kubernetes/model/space-namespace';
export { ConfigMap, ConfigMaps } from './kubernetes/model/configmap.model';
export { Space, Environment, Spaces, asSpaces } from './kubernetes/model/space.model';
export {
  BuildConfig,
  BuildConfigs,
  combineBuildConfigAndBuilds,
  filterPipelines,
  findBuildConfigByID
} from './kubernetes/model/buildconfig.model';

export { BuildConfigStore } from './kubernetes/store/buildconfig.store';
export { BuildStore } from './kubernetes/store/build.store';
export { OAuthConfigStore } from './kubernetes/store/oauth-config-store';
export { SpaceStore } from './kubernetes/store/space.store';

export { DevNamespaceScope } from './kubernetes/service/devnamespace.scope';
export { KubernetesRestangularModule } from './kubernetes/service/kubernetes.restangular';
export { ConfigMapService } from './kubernetes/service/configmap.service';
export { ServiceService } from './kubernetes/service/service.service';
export { DeploymentService } from './kubernetes/service/deployment.service';
export { DeploymentConfigService } from './kubernetes/service/deploymentconfig.service';
export { RouteService } from './kubernetes/service/route.service';

export { DeploymentView, DeploymentViews } from './kubernetes/view/deployment.view';

export { AbstractWatchComponent } from './kubernetes/support/abstract-watch.component';

export { PipelineModule } from './kubernetes/ui/pipeline/pipeline.module';
export { StatusListModule } from './kubernetes/ui/status/status-list.module';

export { KubernetesStoreModule } from './kubernetes/kubernetes.store.module';

export { OnLogin } from './shared/onlogin.service';
