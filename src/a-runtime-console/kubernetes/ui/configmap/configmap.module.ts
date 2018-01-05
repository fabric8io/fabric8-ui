import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ModalModule } from "ngx-modal";
import { ConfigMapsListPage } from "./list-page/list-page.configmap.component";
import { ConfigMapsListToolbarComponent } from "./list-toolbar/list-toolbar.configmap.component";
import { ConfigMapsListComponent } from "./list/list.configmap.component";
import { ConfigMapViewPage } from "./view-page/view-page.configmap.component";
import { ConfigMapViewWrapperComponent } from "./view-wrapper/view-wrapper.configmap.component";
import { ConfigMapViewToolbarComponent } from "./view-toolbar/view-toolbar.configmap.component";
import { ConfigMapViewComponent } from "./view/view.configmap.component";
import { ConfigMapEditPage } from "./edit-page/edit-page.configmap.component";
import { ConfigMapEditWrapperComponent } from "./edit-wrapper/edit-wrapper.configmap.component";
import { ConfigMapEditToolbarComponent } from "./edit-toolbar/edit-toolbar.configmap.component";
import { ConfigMapEditComponent } from "./edit/edit.configmap.component";
import { ConfigMapDeleteDialog } from "./delete-dialog/delete-dialog.configmap.component";
import { Fabric8CommonModule } from "../../../common/common.module";
import { MomentModule } from "angular2-moment";
import { KubernetesComponentsModule } from "../../components/components.module";

export const configMapRoutes: Routes = [
  { path: '', component: ConfigMapsListPage },
  { path: ':id', component: ConfigMapViewPage },
  { path: ':id/edit', component: ConfigMapEditPage },
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(configMapRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule,
  ],
  declarations: [
    ConfigMapsListPage,
    ConfigMapsListToolbarComponent,
    ConfigMapsListComponent,
    ConfigMapViewPage,
    ConfigMapViewWrapperComponent,
    ConfigMapViewToolbarComponent,
    ConfigMapViewComponent,
    ConfigMapEditPage,
    ConfigMapEditWrapperComponent,
    ConfigMapEditToolbarComponent,
    ConfigMapEditComponent,
    ConfigMapDeleteDialog,
  ],
  entryComponents: [
    ConfigMapDeleteDialog,
    ConfigMapEditPage,
  ],
  exports: [
    ModalModule,
    ConfigMapsListComponent,
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class ConfigMapModule {
}
