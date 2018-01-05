import { NgModule } from "@angular/core";
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ModalModule } from "ngx-modal";
import { SpacesListPage } from "./list-page/list-page.space.component";
import { SpacesListComponent } from "./list/list.space.component";
import { SpaceViewWrapperComponent } from "./view-wrapper/view-wrapper.space.component";
import { SpaceViewToolbarComponent } from "./view-toolbar/view-toolbar.space.component";
import { SpaceViewComponent } from "./view/view.space.component";
import { SpaceEditWrapperComponent } from "./edit-wrapper/edit-wrapper.space.component";
import { SpaceEditToolbarComponent } from "./edit-toolbar/edit-toolbar.space.component";
import { SpaceEditComponent } from "./edit/edit.space.component";
import { SpaceDeleteDialog } from "./delete-dialog/delete-dialog.space.component";
import { Fabric8CommonModule } from "../../../common/common.module";
import { MomentModule } from "angular2-moment";
import { SpaceViewPage } from "./view-page/view-page.space.component";
import { SpaceEditPage } from "./edit-page/edit-page.space.component";
import { SpacesListToolbarComponent } from "./list-toolbar/list-toolbar.space.component";
import { KubernetesComponentsModule } from "../../components/components.module";
import { SpaceStore } from '../../store/space.store';
import { ConfigMapStore } from '../../store/configmap.store';
import { NamespaceStore } from '../../store/namespace.store';
import { ConfigMapService } from '../../service/configmap.service';
import { NamespaceScope } from '../../service/namespace.scope';
import { NamespaceService } from '../../service/namespace.service';

const routes: Routes = [
  { path: '', component: SpacesListPage},
  { path: ':id', component: SpaceViewPage },
  { path: ':id/edit', component: SpaceEditPage },
];

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    RouterModule.forChild(routes),
    RouterModule,
    Fabric8CommonModule,
    KubernetesComponentsModule,
  ],
  declarations: [
    SpacesListPage,
    SpacesListToolbarComponent,
    SpacesListComponent,
    SpaceViewPage,
    SpaceViewWrapperComponent,
    SpaceViewToolbarComponent,
    SpaceViewComponent,
    SpaceEditPage,
    SpaceEditWrapperComponent,
    SpaceEditToolbarComponent,
    SpaceEditComponent,
    SpaceDeleteDialog,
  ],
  providers: [
    BsDropdownConfig,
    SpaceStore,
    NamespaceStore,
    ConfigMapService,
    ConfigMapStore,
    NamespaceScope,
    NamespaceService
  ],
  entryComponents: [
    SpaceDeleteDialog,
    SpaceEditPage,
  ],
  exports: [
    SpacesListPage,
  ],
})
export class SpaceModule {
}
