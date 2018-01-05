import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ModalModule } from "ngx-modal";
import { PodsListPage } from "./list-page/list-page.pod.component";
import { PodsListToolbarComponent } from "./list-toolbar/list-toolbar.pod.component";
import { PodsListComponent } from "./list/list.pod.component";
import { PodViewPage } from "./view-page/view-page.pod.component";
import { PodViewWrapperComponent } from "./view-wrapper/view-wrapper.pod.component";
import { PodViewToolbarComponent } from "./view-toolbar/view-toolbar.pod.component";
import { PodViewComponent } from "./view/view.pod.component";
import { PodEditPage } from "./edit-page/edit-page.pod.component";
import { PodEditWrapperComponent } from "./edit-wrapper/edit-wrapper.pod.component";
import { PodEditToolbarComponent } from "./edit-toolbar/edit-toolbar.pod.component";
import { PodEditComponent } from "./edit/edit.pod.component";
import { PodDeleteDialog } from "./delete-dialog/delete-dialog.pod.component";
import { Fabric8CommonModule } from "../../../common/common.module";
import { MomentModule } from "angular2-moment";
import { KubernetesComponentsModule } from "../../components/components.module";

export const podRoutes: Routes = [
  { path: '', component: PodsListPage },
  { path: ':id', component: PodViewPage },
  { path: ':id/edit', component: PodEditPage },
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(podRoutes),
    Fabric8CommonModule,
    KubernetesComponentsModule,
  ],
  declarations: [
    PodsListPage,
    PodsListToolbarComponent,
    PodsListComponent,
    PodViewPage,
    PodViewWrapperComponent,
    PodViewToolbarComponent,
    PodViewComponent,
    PodEditPage,
    PodEditWrapperComponent,
    PodEditToolbarComponent,
    PodEditComponent,
    PodDeleteDialog,
  ],
  entryComponents: [
    PodDeleteDialog,
    PodEditPage,
  ],
  exports: [
    ModalModule,
    PodsListComponent,
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class PodModule {
}
