import { EnvironmentDetailComponent } from './detail/detail.environment.component';
import { ServiceModule } from './../service/service.module';
import { ServicesListComponent } from './../service/list/list.service.component';
import { ReplicaSetModule } from './../replicaset/replicaset.module';
import { PodModule } from './../pod/pod.module';
import { EventModule } from './../event/event.module';
import { ConfigMapModule } from './../configmap/configmap.module';
import { EnvironmentRoutingModule } from './environment-routing.module';
import { DeploymentModule } from './../deployment/deployment.module';
import { ConfigMapStore } from './../../store/configmap.store';
import { NamespaceStore } from './../../store/namespace.store';

import {NgModule} from '@angular/core';
import {BsDropdownConfig, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ng2-bootstrap';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {ModalModule} from 'ng2-modal';
import { TreeListModule, SlideOutPanelModule } from 'ngx-widgets';
import { TreeModule } from 'angular2-tree-component';
import {Fabric8CommonModule} from '../../../common/common.module';
import {MomentModule} from 'angular2-moment';
import {KubernetesComponentsModule} from '../../components/components.module';
import {ConfigMapService} from '../../service/configmap.service';
import {NamespaceScope} from '../../service/namespace.scope';
import {NamespaceService} from '../../service/namespace.service';
import { EnvironmentListPageComponent } from './list-page/list-page.environment.component';
import { EnvironmentListComponent } from './list/list.environment.component';
import { EnvironmentListToolbarComponent } from './list-toolbar/list-toolbar.environment.component';

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
    TreeListModule,
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
    EnvironmentDetailComponent,
  ],
  providers: [
    BsDropdownConfig,
    NamespaceStore,
    ConfigMapService,
    ConfigMapStore,
    NamespaceScope,
    NamespaceService,
  ],
  exports: [
    EnvironmentListPageComponent,
  ],
})
export class EnvironmentModule {
}
