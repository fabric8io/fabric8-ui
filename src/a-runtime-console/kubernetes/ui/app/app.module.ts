import { ServiceModule } from "./../service/service.module";
import { ReplicaSetModule } from "./../replicaset/replicaset.module";
import { PodModule } from "./../pod/pod.module";
import { EventModule } from "./../event/event.module";
import { ConfigMapModule } from "./../configmap/configmap.module";
import { DeploymentModule } from "./../deployment/deployment.module";
import { ConfigMapStore } from "./../../store/configmap.store";
import { NamespaceStore } from "./../../store/namespace.store";
import { NgModule } from "@angular/core";
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { ModalModule } from "ngx-modal";
import { Fabric8CommonModule } from "../../../common/common.module";
import { MomentModule } from "angular2-moment";
import { KubernetesComponentsModule } from "../../components/components.module";
import { ConfigMapService } from "../../service/configmap.service";
import { NamespaceScope } from "../../service/namespace.scope";
import { NamespaceService } from "../../service/namespace.service";
import { AppListPageComponent } from "./list-page/list-page.app.component";
import { AppListComponent } from "./list/list.app.component";
import { AppRoutingModule } from "./app-routing.module";

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
    // Our Routing MUST go before the other Kuberenetes UI modules, so our routes take precedence
    AppRoutingModule,
    DeploymentModule,
    ConfigMapModule,
    EventModule,
    PodModule,
    ReplicaSetModule,
    ServiceModule,
  ],
  declarations: [
    AppListPageComponent,
    AppListComponent,
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
    AppListPageComponent,
  ],
})
export class AppModule {
}
