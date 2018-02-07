import { ConfigMapStore } from './../../store/configmap.store';
import { NamespaceStore } from './../../store/namespace.store';
import { ConfigMapModule } from './../configmap/configmap.module';
import { DeploymentModule } from './../deployment/deployment.module';
import { EventModule } from './../event/event.module';
import { PodModule } from './../pod/pod.module';
import { ReplicaSetModule } from './../replicaset/replicaset.module';
import { ServicesListComponent } from './../service/list/list.service.component';
import { ServiceModule } from './../service/service.module';
import { EnvironmentDetailComponent } from './detail/detail.environment.component';
import { EnvironmentRoutingModule } from './environment-routing.module';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MomentModule } from 'angular2-moment';
import { TreeModule } from 'angular2-tree-component';
import { TabsModule } from 'ngx-bootstrap';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import { SlideOutPanelModule } from 'ngx-widgets';
import { ActionModule } from 'patternfly-ng';
import { Fabric8CommonModule } from '../../../common/common.module';
import { KubernetesComponentsModule } from '../../components/components.module';
import { ConfigMapService } from '../../service/configmap.service';
import { NamespaceScope } from '../../service/namespace.scope';
import { NamespaceService } from '../../service/namespace.service';
import { EnvironmentListPageComponent } from './list-page/list-page.environment.component';
import { EnvironmentListToolbarComponent } from './list-toolbar/list-toolbar.environment.component';
import { EnvironmentListComponent } from './list/list.environment.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule,
    Fabric8CommonModule,
    KubernetesComponentsModule,
    ActionModule,
    TreeModule,
    TabsModule.forRoot(),
    // Our Routing MUST go before the other Kuberenetes UI modules, so our routes take precedence
    EnvironmentRoutingModule,
    DeploymentModule,
    ConfigMapModule,
    EventModule,
    PodModule,
    ReplicaSetModule,
    ServiceModule,
    SlideOutPanelModule
  ],
  declarations: [
    EnvironmentListPageComponent,
    EnvironmentListToolbarComponent,
    EnvironmentListComponent,
    EnvironmentDetailComponent
  ],
  providers: [
    BsDropdownConfig,
    NamespaceStore,
    ConfigMapService,
    ConfigMapStore,
    NamespaceScope,
    NamespaceService
  ],
  exports: [
    EnvironmentListPageComponent
  ]
})
export class EnvironmentModule {
}
