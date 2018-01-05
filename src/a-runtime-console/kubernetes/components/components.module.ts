import { NgModule } from "@angular/core";
import { PodPhaseIconComponent } from "./pod-phase-icon/pod-phase-icon.component";
import { KubernetesLabelsComponent } from "./k8s-labels/k8s-labels.component";
import { Fabric8CommonModule } from "../../common/common.module";
import { CommonModule } from "@angular/common";
import { PipelineStatusComponent } from "./pipeline-status/pipeline-status.component";
import { BuildStatusIconComponent } from "./build-status-icon/build-status-icon.component";

@NgModule({
  imports: [
    CommonModule,
    Fabric8CommonModule,
  ],
  declarations: [
    BuildStatusIconComponent,
    KubernetesLabelsComponent,
    PodPhaseIconComponent,
    PipelineStatusComponent
  ],
  exports: [
    BuildStatusIconComponent,
    KubernetesLabelsComponent,
    PodPhaseIconComponent,
    PipelineStatusComponent
  ],
})
export class KubernetesComponentsModule {
}
