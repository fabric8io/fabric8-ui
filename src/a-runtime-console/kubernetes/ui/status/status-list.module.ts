import {NgModule} from "@angular/core";
import {BsDropdownConfig, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {RouterModule} from "@angular/router";
import {ModalModule} from "ngx-modal";
import {Fabric8CommonModule} from "../../../common/common.module";
import {MomentModule} from "angular2-moment";
import {KubernetesComponentsModule} from "../../components/components.module";
import {SpaceStore} from "../../store/space.store";
import {NamespaceStore} from "../../store/namespace.store";
import {StatusListComponent} from "./status-list.component";
import {StatusInfoComponent} from "./status-info-component";


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
  ],
  declarations: [
    StatusInfoComponent,
    StatusListComponent,
  ],
  providers: [
    BsDropdownConfig,
    SpaceStore,
    NamespaceStore,
  ],
  exports: [
    StatusInfoComponent,
    StatusListComponent,
  ],
})
export class StatusListModule {
}
