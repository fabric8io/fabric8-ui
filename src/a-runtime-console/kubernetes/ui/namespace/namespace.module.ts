import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BsDropdownConfig, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {ModalModule} from "ngx-modal";
import {NamespacesListPage} from "./list-page/list-page.namespace.component";
import {NamespacesListComponent} from "./list/list.namespace.component";
import {NamespaceViewWrapperComponent} from "./view-wrapper/view-wrapper.namespace.component";
import {NamespaceViewToolbarComponent} from "./view-toolbar/view-toolbar.namespace.component";
import {NamespaceViewComponent} from "./view/view.namespace.component";
import {NamespaceEditWrapperComponent} from "./edit-wrapper/edit-wrapper.namespace.component";
import {NamespaceEditToolbarComponent} from "./edit-toolbar/edit-toolbar.namespace.component";
import {NamespaceEditComponent} from "./edit/edit.namespace.component";
import {NamespaceDeleteDialog} from "./delete-dialog/delete-dialog.namespace.component";
import {Fabric8CommonModule} from "../../../common/common.module";
import {MomentModule} from "angular2-moment";
import {NamespaceViewPage} from "./view-page/view-page.namespace.component";
import {NamespaceEditPage} from "./edit-page/edit-page.namespace.component";
import {NamespacesListToolbarComponent} from "./list-toolbar/list-toolbar.namespace.component";
import {KubernetesComponentsModule} from "../../components/components.module";

const routes: Routes = [
  { path: '', component: NamespacesListPage},
  { path: ':id', component: NamespaceViewPage },
  { path: ':id/edit', component: NamespaceEditPage },
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
    NamespacesListPage,
    NamespacesListToolbarComponent,
    NamespacesListComponent,
    NamespaceViewPage,
    NamespaceViewWrapperComponent,
    NamespaceViewToolbarComponent,
    NamespaceViewComponent,
    NamespaceEditPage,
    NamespaceEditWrapperComponent,
    NamespaceEditToolbarComponent,
    NamespaceEditComponent,
    NamespaceDeleteDialog,
  ],
  entryComponents: [
    NamespaceDeleteDialog,
    NamespaceEditPage,
  ],
  exports: [
    ModalModule,
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class NamespaceModule {
}
