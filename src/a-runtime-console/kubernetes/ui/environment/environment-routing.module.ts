import { ConfigMapStore } from './../../store/configmap.store';
import { NamespaceStore } from './../../store/namespace.store';
import { configMapRoutes } from './../configmap/configmap.module';
import { deploymentRoutes } from './../deployment/deployment-routing.module';
import { eventRoutes } from './../event/event.module';
import { podRoutes } from './../pod/pod.module';
import { replicaSetRoutes } from './../replicaset/replicaset.module';
import { serviceRoutes } from './../service/service.module';
import { EnvironmentDetailComponent } from './detail/detail.environment.component';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { TreeModule } from 'angular2-tree-component';
import { ModalModule } from 'ngx-modal';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { ConfigMapService } from '../../service/configmap.service';
import { NamespaceScope } from '../../service/namespace.scope';
import { NamespaceService } from '../../service/namespace.service';
import { EnvironmentListPageComponent } from './list-page/list-page.environment.component';
import { EnvironmentListToolbarComponent } from './list-toolbar/list-toolbar.environment.component';
import { EnvironmentListComponent } from './list/list.environment.component';

const routes: Routes = [
  {
    path: '',
    component: EnvironmentListPageComponent,
    data: {
      'hide-toolbar': true
    },
    // Can't use lazy loading here as we need to import in to another module, and that doesn't work yet
    children: [
      {
        path: 'namespaces/:namespace/configmaps',
        component: EnvironmentDetailComponent,
        children: configMapRoutes
      },
      {
        path: 'namespaces/:namespace/deployments',
        component: EnvironmentDetailComponent,
        children: deploymentRoutes
      },
      {
        path: 'namespaces/:namespace/events',
        component: EnvironmentDetailComponent,
        children: eventRoutes
      },
      {
        path: 'namespaces/:namespace/replicasets',
        component: EnvironmentDetailComponent,
        children: replicaSetRoutes
      },
      {
        path: 'namespaces/:namespace/pods',
        component: EnvironmentDetailComponent,
        children: podRoutes
      },
      {
        path: 'namespaces/:namespace/services',
        component: EnvironmentDetailComponent,
        children: serviceRoutes
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class EnvironmentRoutingModule {
}
