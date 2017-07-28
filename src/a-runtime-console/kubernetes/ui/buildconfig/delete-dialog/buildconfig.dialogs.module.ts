import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {ModalModule} from "ng2-modal";
import {Fabric8CommonModule} from "../../../../common/common.module";
import {MomentModule} from "angular2-moment";
import {KubernetesComponentsModule} from "../../../components/components.module";
import {BuildConfigDeleteDialog} from "./delete-dialog.buildconfig.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ModalModule,
    MomentModule,
    Fabric8CommonModule,
    KubernetesComponentsModule,
  ],
  declarations: [
    BuildConfigDeleteDialog,
  ],
  entryComponents: [
    BuildConfigDeleteDialog,
  ],
  exports: [
    ModalModule,
    BuildConfigDeleteDialog,
  ],
})
export class BuildConfigDialogsModule {
}
