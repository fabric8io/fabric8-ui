import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";


const routes: Routes = [
  { path: 'namespaces/:namespace/builds', loadChildren: './build/build.module#BuildModule' },
  { path: 'namespaces/:namespace/buildconfigs', loadChildren: './buildconfig/buildconfig.module#BuildConfigModule' },
  { path: 'namespaces/:namespace/pipelines', loadChildren: './pipeline/pipeline-route.module#PipelineRouteModule' },
  { path: 'namespaces/:namespace/pipelinehistory', loadChildren: './pipeline/pipeline-full-history.module#PipelineFullHistoryModule' },
  { path: 'namespaces/:namespace/configmaps', loadChildren: './configmap/configmap.module#ConfigMapModule' },
  { path: 'namespaces/:namespace/deployments', loadChildren: './deployment/deployment.module#DeploymentModule' },
  { path: 'namespaces/:namespace/events', loadChildren: './event/event.module#EventModule' },
  { path: 'namespaces/:namespace/replicasets', loadChildren: './replicaset/replicaset.module#ReplicaSetModule' },
  { path: 'namespaces/:namespace/pods', loadChildren: './pod/pod.module#PodModule' },
  { path: 'namespaces/:namespace/services', loadChildren: './service/service.module#ServiceModule' },
  { path: 'namespace', loadChildren: './namespace/namespace.module#NamespaceModule' },
  { path: 'spaces', loadChildren: './space/space.module#SpaceModule' },
  { path: 'environments', loadChildren: './environment/environment.module#EnvironmentModule'},
  { path: 'apps', loadChildren: './app/app.module#AppModule'},
  { path: 'status', loadChildren: './status/status-list.module#StatusListModule'}
];


@NgModule({
  imports: [
/*
    CommonModule,
    FormsModule,
    DeploymentModule,
    NamespaceModule,
*/
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class KubernetesUIModule {
}
