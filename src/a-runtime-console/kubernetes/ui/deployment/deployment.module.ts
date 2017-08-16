import { DeploymentRoutingModule } from './deployment-routing.module';
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {BsDropdownConfig, BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {FormsModule} from "@angular/forms";
import {RouterModule, Routes} from "@angular/router";
import {ModalModule} from "ngx-modal";
import {DeploymentsListPage} from "./list-page/list-page.deployment.component";
import {DeploymentsListToolbarComponent} from "./list-toolbar/list-toolbar.deployment.component";
import {DeploymentsListComponent} from "./list/list.deployment.component";
import {DeploymentViewPage} from "./view-page/view-page.deployment.component";
import {DeploymentViewWrapperComponent} from "./view-wrapper/view-wrapper.deployment.component";
import {DeploymentViewToolbarComponent} from "./view-toolbar/view-toolbar.deployment.component";
import {DeploymentViewComponent} from "./view/view.deployment.component";
import {DeploymentEditPage} from "./edit-page/edit-page.deployment.component";
import {DeploymentEditWrapperComponent} from "./edit-wrapper/edit-wrapper.deployment.component";
import {DeploymentEditToolbarComponent} from "./edit-toolbar/edit-toolbar.deployment.component";
import {DeploymentEditComponent} from "./edit/edit.deployment.component";
import {DeploymentDeleteDialog} from "./delete-dialog/delete-dialog.deployment.component";
import {Fabric8CommonModule} from "../../../common/common.module";
import {MomentModule} from "angular2-moment";
import {KubernetesComponentsModule} from "../../components/components.module";
import {DeploymentScaleDialog} from './scale-dialog/scale-dialog.deployment.component';

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    Fabric8CommonModule,
    KubernetesComponentsModule,
    DeploymentRoutingModule,
  ],
  declarations: [
    DeploymentsListPage,
    DeploymentsListToolbarComponent,
    DeploymentsListComponent,
    DeploymentViewPage,
    DeploymentViewWrapperComponent,
    DeploymentViewToolbarComponent,
    DeploymentViewComponent,
    DeploymentEditPage,
    DeploymentEditWrapperComponent,
    DeploymentEditToolbarComponent,
    DeploymentEditComponent,
    DeploymentDeleteDialog,
    DeploymentScaleDialog,
  ],
  entryComponents: [
    DeploymentDeleteDialog,
    DeploymentEditPage,
  ],
  exports: [
    ModalModule,
    DeploymentsListComponent,
    DeploymentDeleteDialog,
    DeploymentScaleDialog,
  ],
  providers: [
    BsDropdownConfig
  ]
})
export class DeploymentModule {
}
